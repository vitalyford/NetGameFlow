import React, { useState, useRef, useEffect } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = 'top',
    delay = 300
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [actualPosition, setActualPosition] = useState(position);
    const timeoutRef = useRef<number | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            adjustPosition();
        }, delay) as unknown as number;
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };
    // Check if we're inside a step controller for styling
    const isInStepController = () => {
        return triggerRef.current?.closest(`.${styles.stepTooltip}`) !== null ||
            triggerRef.current?.closest('.step-tooltip') !== null; // Fallback for external components
    };

    const adjustPosition = () => {
        if (!tooltipRef.current || !triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        // Check if we're inside a step controller
        const stepController = triggerRef.current.closest(`.${styles.stepTooltip}`) ||
            triggerRef.current.closest('.step-tooltip'); // Fallback for external components
        let newPosition = position;
        if (stepController) {
            const controllerContent = stepController.querySelector('.step-details-content') || stepController;
            const contentRect = controllerContent.getBoundingClientRect();

            // More conservative sizing for better control
            const maxWidth = Math.max(150, Math.min(300, contentRect.width * 0.5));
            const maxHeight = Math.max(60, contentRect.height * 0.6);

            tooltipRef.current.style.maxWidth = `${maxWidth}px`;
            tooltipRef.current.style.maxHeight = `${maxHeight}px`;

            // Force re-measure after size change
            setTimeout(() => {
                if (!tooltipRef.current) return;
                const updatedTooltipRect = tooltipRef.current.getBoundingClientRect();

                // Calculate available space with smaller margins for closer positioning
                const margin = 4;
                const spaceRight = contentRect.right - triggerRect.right - margin;
                const spaceLeft = triggerRect.left - contentRect.left - margin;
                const spaceBottom = contentRect.bottom - triggerRect.bottom - margin;
                const spaceTop = triggerRect.top - contentRect.top - margin;

                let bestPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

                // Prefer positions that keep tooltip close to trigger
                if (spaceBottom >= updatedTooltipRect.height + 5) {
                    bestPosition = 'bottom';
                } else if (spaceTop >= updatedTooltipRect.height + 5) {
                    bestPosition = 'top';
                } else if (spaceRight >= updatedTooltipRect.width + 5) {
                    bestPosition = 'right';
                } else if (spaceLeft >= updatedTooltipRect.width + 5) {
                    bestPosition = 'left';
                } else {
                    // Constrain to the best available space
                    const spaces = { bottom: spaceBottom, top: spaceTop, right: spaceRight, left: spaceLeft };
                    const maxSpaceDirection = (Object.keys(spaces) as Array<keyof typeof spaces>).reduce((a, b) =>
                        spaces[a] > spaces[b] ? a : b
                    );

                    bestPosition = maxSpaceDirection;

                    // Apply tight constraints
                    if (bestPosition === 'right' || bestPosition === 'left') {
                        const availableWidth = Math.max(100, spaces[bestPosition] - 3);
                        tooltipRef.current.style.maxWidth = `${availableWidth}px`;
                        tooltipRef.current.style.overflowY = 'auto';
                    } else {
                        const availableHeight = Math.max(40, spaces[bestPosition] - 3);
                        tooltipRef.current.style.maxHeight = `${availableHeight}px`;
                        tooltipRef.current.style.overflowY = 'auto';
                    }
                }

                setActualPosition(bestPosition);

                // Ensure tooltip doesn't extend beyond container bounds
                requestAnimationFrame(() => {
                    if (!tooltipRef.current) return;
                    const finalRect = tooltipRef.current.getBoundingClientRect();

                    // Strict boundary enforcement with minimal margins
                    if (finalRect.right > contentRect.right - 2) {
                        const overflow = finalRect.right - contentRect.right + 2;
                        tooltipRef.current.style.transform += ` translateX(-${overflow}px)`;
                    }
                    if (finalRect.left < contentRect.left + 2) {
                        const overflow = contentRect.left + 2 - finalRect.left;
                        tooltipRef.current.style.transform += ` translateX(${overflow}px)`;
                    }
                    if (finalRect.bottom > contentRect.bottom - 2) {
                        const overflow = finalRect.bottom - contentRect.bottom + 2;
                        tooltipRef.current.style.transform += ` translateY(-${overflow}px)`;
                    }
                    if (finalRect.top < contentRect.top + 2) {
                        const overflow = contentRect.top + 2 - finalRect.top;
                        tooltipRef.current.style.transform += ` translateY(${overflow}px)`;
                    }
                });
            }, 0);
        } else {
            // Original positioning logic for outside step controller
            if (position === 'top' && triggerRect.top - tooltipRect.height < 10) {
                newPosition = 'bottom';
            } else if (position === 'bottom' && triggerRect.bottom + tooltipRect.height > viewport.height - 10) {
                newPosition = 'top';
            } else if (position === 'left' && triggerRect.left - tooltipRect.width < 10) {
                newPosition = 'right';
            } else if (position === 'right' && triggerRect.right + tooltipRect.width > viewport.width - 10) {
                newPosition = 'left';
            }

            setActualPosition(newPosition);
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className={styles.container}
            ref={triggerRef}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={`${styles.tooltip} ${styles[actualPosition]} ${isInStepController() ? styles.stepController : ''}`}
                    role="tooltip"
                    aria-hidden={!isVisible}
                >
                    <div className={styles.content}>
                        {content}
                    </div>
                    <div className={`${styles.arrow} ${styles[`arrow${actualPosition.charAt(0).toUpperCase() + actualPosition.slice(1)}`]}`} />
                </div>
            )}
        </div>
    );
};
