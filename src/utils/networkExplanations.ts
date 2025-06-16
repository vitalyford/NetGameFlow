// Comprehensive network concept explanations for high school students
export const NETWORK_EXPLANATIONS = {
  'IP': {
    title: 'IP Address (Internet Protocol)',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Your home address, but for computers!</p>
        
        <p>Just like your house has a unique address so mail can find you, every device connected to the internet has a unique IP address so data can find it.</p>
        
        <h4>🏠 Real World Example:</h4>
        <p>If you live at "123 Main Street, Anytown, USA", that's your physical address. Your computer might have an IP address like "192.168.1.100" - that's its internet address!</p>
        
        <h4>📍 Two Types:</h4>
        <ul>
          <li><strong>IPv4:</strong> Looks like 192.168.1.1 (most common, like short addresses)</li>
          <li><strong>IPv6:</strong> Looks like 2001:0db8:85a3::8a2e (newer, like really long addresses for when we run out of short ones)</li>
        </ul>
        
        <h4>🔍 Fun Fact:</h4>
        <p>There are about 4.3 billion possible IPv4 addresses, but with billions of devices, we're running out! That's why IPv6 was created - it has enough addresses for every grain of sand on Earth!</p>
      </div>
    `
  },

  'DNS': {
    title: 'DNS (Domain Name System)',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> The internet's phone book!</p>
        
        <p>You want to visit "google.com" but computers only understand numbers (IP addresses). DNS translates "google.com" into "172.217.164.110" so your computer knows where to go.</p>
        
        <h4>📞 Real World Example:</h4>
        <p>Instead of memorizing your friend's phone number (555-0123), you just save their name in your contacts. DNS does the same thing - it saves website names and their "phone numbers" (IP addresses).</p>
        
        <h4>🔄 How it Works:</h4>
        <ol>
          <li>You type "youtube.com" in your browser</li>
          <li>Your computer asks DNS: "What's YouTube's address?"</li>
          <li>DNS replies: "It's 208.65.153.238"</li>
          <li>Your computer connects to that address</li>
        </ol>
        
        <h4>⚡ Why It's Important:</h4>
        <p>Without DNS, you'd have to memorize IP addresses like 172.217.164.110 instead of just typing google.com. Imagine having to remember phone numbers for every website!</p>
      </div>
    `
  },

  'TCP': {
    title: 'TCP (Transmission Control Protocol)',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Certified mail with tracking!</p>
        
        <p>TCP makes sure your data gets delivered completely and in the right order, just like certified mail ensures your important letter arrives safely.</p>
        
        <h4>📮 Real World Example:</h4>
        <p>Imagine sending a 1000-piece puzzle through the mail. TCP would:</p>
        <ul>
          <li>Number each piece (1, 2, 3...)</li>
          <li>Send them in separate envelopes</li>
          <li>Check that all pieces arrived</li>
          <li>Ask for missing pieces to be resent</li>
          <li>Put them back in order (1, 2, 3...) before giving you the complete puzzle</li>
        </ul>
        
        <h4>🛡️ What TCP Guarantees:</h4>
        <ul>
          <li><strong>Reliability:</strong> All data arrives (or you know it didn't)</li>
          <li><strong>Order:</strong> Data arrives in the correct sequence</li>
          <li><strong>Error Checking:</strong> Damaged data is detected and resent</li>
        </ul>
        
        <h4>🎯 Perfect For:</h4>
        <p>Web browsing, email, file downloads - anything where you need every bit of data to be perfect!</p>
      </div>
    `
  },

  'HTTP': {
    title: 'HTTP (HyperText Transfer Protocol)',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> The language web browsers and websites use to talk!</p>
        
        <p>When you visit a website, your browser speaks HTTP to ask for web pages, and the website speaks HTTP back to send them to you.</p>
        
        <h4>🗣️ Real World Example:</h4>
        <p>It's like ordering at a restaurant:</p>
        <ul>
          <li><strong>You (Browser):</strong> "Can I have the homepage, please?" (GET request)</li>
          <li><strong>Waiter (Server):</strong> "Here's your homepage!" (200 OK response)</li>
        </ul>
        
        <h4>📝 Common HTTP "Phrases":</h4>
        <ul>
          <li><strong>GET:</strong> "Please give me this web page"</li>
          <li><strong>POST:</strong> "Here's some information to save" (like submitting a form)</li>
          <li><strong>200 OK:</strong> "Here you go, everything worked!"</li>
          <li><strong>404 Not Found:</strong> "Sorry, that page doesn't exist"</li>
        </ul>
        
        <h4>🌐 Where You See It:</h4>
        <p>Every time you visit a website, click a link, or submit a form, your browser is using HTTP to communicate!</p>
      </div>
    `
  },

  'HTTPS': {
    title: 'HTTPS (HTTP Secure)',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> HTTP wearing a bulletproof vest and speaking in secret code!</p>
        
        <p>HTTPS is regular HTTP but with encryption - it scrambles your data so only you and the website can understand it.</p>
        
        <h4>🔒 Real World Example:</h4>
        <p>Imagine sending a postcard vs. a sealed letter:</p>
        <ul>
          <li><strong>HTTP (Postcard):</strong> Anyone can read your message as it travels</li>
          <li><strong>HTTPS (Sealed Letter):</strong> Only you and the recipient can read it</li>
        </ul>
        
        <h4>🛡️ What HTTPS Protects:</h4>
        <ul>
          <li><strong>Passwords:</strong> When you log into accounts</li>
          <li><strong>Credit Cards:</strong> When you shop online</li>
          <li><strong>Personal Info:</strong> Messages, emails, private data</li>
        </ul>
        
        <h4>🔍 How to Spot It:</h4>
        <p>Look for the lock icon 🔒 in your browser's address bar and "https://" at the start of the URL. Most modern browsers warn you if a site isn't using HTTPS!</p>
        
        <h4>⚠️ Why It Matters:</h4>
        <p>Without HTTPS, hackers could steal your passwords, read your messages, or capture your credit card info as it travels across the internet!</p>
      </div>
    `
  },

  'Router': {
    title: 'Router',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A smart traffic cop for internet data!</p>
        
        <p>A router decides the best path for your data to travel from your device to websites and back, just like a GPS finds the best route for your car trip.</p>
        
        <h4>🚦 Real World Example:</h4>
        <p>Imagine you're driving from New York to Los Angeles. There are many possible routes:</p>
        <ul>
          <li>Through Chicago (fastest but might be congested)</li>
          <li>Through Denver (longer but less traffic)</li>
          <li>Through Atlanta (scenic route)</li>
        </ul>
        <p>A router does the same thing - it picks the best internet "highway" for your data!</p>
        
        <h4>🏠 Types of Routers:</h4>
        <ul>
          <li><strong>Home Router:</strong> Connects your devices to the internet (WiFi router)</li>
          <li><strong>ISP Router:</strong> Your internet company's big router</li>
          <li><strong>Internet Backbone Routers:</strong> Massive routers that connect cities and countries</li>
        </ul>
        
        <h4>🧠 What Routers Know:</h4>
        <p>Every router has a "routing table" - like a GPS map that shows the best paths to different internet destinations. They constantly share updates about traffic conditions!</p>
      </div>
    `
  },

  'Packet': {
    title: 'Data Packet',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A piece of a jigsaw puzzle sent through the mail!</p>
        
        <p>When you send data over the internet, it gets broken into small pieces called packets. Each packet travels independently and gets reassembled at the destination.</p>
        
        <h4>🧩 Real World Example:</h4>
        <p>Imagine sending a 1000-piece puzzle to a friend:</p>
        <ul>
          <li>You put each piece in its own envelope</li>
          <li>Write the piece number on each envelope (1 of 1000, 2 of 1000...)</li>
          <li>Mail them all separately</li>
          <li>Your friend collects all envelopes and rebuilds the puzzle</li>
        </ul>
        
        <h4>📦 What's in a Packet:</h4>
        <ul>
          <li><strong>Header:</strong> Like the envelope with addresses and tracking info</li>
          <li><strong>Data:</strong> The actual piece of your message/file</li>
          <li><strong>Footer:</strong> Error checking code to make sure it arrived correctly</li>
        </ul>
        
        <h4>🛣️ Why Split Data into Packets:</h4>
        <ul>
          <li><strong>Efficiency:</strong> Multiple packets can travel different routes</li>
          <li><strong>Reliability:</strong> If one packet gets lost, only that piece needs to be resent</li>
          <li><strong>Sharing:</strong> Other people's data can be mixed in between your packets</li>
        </ul>
        
        <h4>📏 Typical Size:</h4>
        <p>Most packets are about 1,500 bytes - roughly the size of a short paragraph of text!</p>
      </div>
    `
  },

  'ISP': {
    title: 'ISP (Internet Service Provider)',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Your internet landlord and postal service combined!</p>
        
        <p>An ISP is the company that provides your internet connection and handles delivering your data to and from the rest of the internet.</p>
        
        <h4>🏢 Real World Example:</h4>
        <p>Just like you need:</p>
        <ul>
          <li><strong>Electric Company:</strong> To provide electricity to your home</li>
          <li><strong>Water Company:</strong> To provide water to your home</li>
          <li><strong>ISP:</strong> To provide internet to your home</li>
        </ul>
        
        <h4>🌐 Common ISPs:</h4>
        <ul>
          <li><strong>Cable:</strong> Comcast, Spectrum, Cox</li>
          <li><strong>Phone:</strong> Verizon, AT&T</li>
          <li><strong>Fiber:</strong> Google Fiber, local fiber companies</li>
          <li><strong>Satellite:</strong> Starlink, HughesNet</li>
        </ul>
        
        <h4>🚛 What Your ISP Does:</h4>
        <ul>
          <li><strong>Last Mile:</strong> Brings internet from the "internet highway" to your house</li>
          <li><strong>Routing:</strong> Directs your data to the right destinations</li>
          <li><strong>DNS:</strong> Often provides DNS servers to translate website names</li>
          <li><strong>Infrastructure:</strong> Maintains cables, cell towers, and equipment</li>
        </ul>
        
        <h4>💰 Different Plans:</h4>
        <p>ISPs offer different speeds and data limits, just like phone plans. Faster speeds cost more, slower speeds cost less!</p>
      </div>
    `
  },

  'Server': {
    title: 'Server',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A super-powered computer that serves information to other computers!</p>
        
        <p>A server is like a restaurant kitchen - it takes orders (requests) from customers (your devices) and serves up what they want (websites, files, emails).</p>
        
        <h4>🍽️ Real World Example:</h4>
        <p>When you go to a restaurant:</p>
        <ul>
          <li><strong>You (Client):</strong> Order food from the menu</li>
          <li><strong>Kitchen (Server):</strong> Prepares your order and serves it to you</li>
          <li><strong>Multiple customers:</strong> Can be served at the same time</li>
        </ul>
        
        <h4>🏢 Types of Servers:</h4>
        <ul>
          <li><strong>Web Server:</strong> Serves websites (like Apache, Nginx)</li>
          <li><strong>Email Server:</strong> Handles your emails</li>
          <li><strong>File Server:</strong> Stores and shares files</li>
          <li><strong>Game Server:</strong> Runs online games</li>
          <li><strong>Database Server:</strong> Stores and organizes data</li>
        </ul>
        
        <h4>💪 Why Servers are Special:</h4>
        <ul>
          <li><strong>Always On:</strong> They run 24/7 without sleeping</li>
          <li><strong>Powerful:</strong> Much faster and stronger than regular computers</li>
          <li><strong>Reliable:</strong> Built to rarely break down</li>
          <li><strong>Multiple Users:</strong> Can handle thousands of requests at once</li>
        </ul>
        
        <h4>🌍 Server Farms:</h4>
        <p>Big companies like Google, Facebook, and Amazon have entire buildings full of servers called "data centers" - like huge digital restaurants serving millions of customers!</p>
      </div>
    `
  },

  'Client': {
    title: 'Client',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A customer asking for service!</p>
        
        <p>In computer terms, a client is any device that requests information or services from a server. Your phone, laptop, and tablet are all clients when they use the internet.</p>
        
        <h4>🛒 Real World Example:</h4>
        <p>You are a "client" when you:</p>
        <ul>
          <li><strong>Go to a restaurant:</strong> You request food from the kitchen (server)</li>
          <li><strong>Visit a bank:</strong> You request account services from the teller (server)</li>
          <li><strong>Browse the internet:</strong> Your device requests web pages from web servers</li>
        </ul>
        
        <h4>📱 Common Clients:</h4>
        <ul>
          <li><strong>Web Browser:</strong> Chrome, Firefox, Safari (requests websites)</li>
          <li><strong>Email App:</strong> Gmail, Outlook (requests emails)</li>
          <li><strong>Streaming App:</strong> Netflix, YouTube (requests videos)</li>
          <li><strong>Social Media App:</strong> Instagram, TikTok (requests posts and updates)</li>
        </ul>
        
        <h4>🔄 Client-Server Relationship:</h4>
        <p>It's always a conversation:</p>
        <ol>
          <li><strong>Client:</strong> "Hey server, can I have the homepage for google.com?"</li>
          <li><strong>Server:</strong> "Sure! Here's the HTML, CSS, and images!"</li>
          <li><strong>Client:</strong> "Thanks! Now can I search for 'cute cats'?"</li>
          <li><strong>Server:</strong> "Here are 1,000,000 search results!"</li>
        </ol>
        
        <h4>🧠 What Makes a Good Client:</h4>
        <p>Good client software is fast, secure, and user-friendly - like having a helpful assistant that gets exactly what you want from servers around the world!</p>
      </div>
    `
  },

  'Protocol': {
    title: 'Network Protocol',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Grammar rules for computer conversations!</p>
        
        <p>A protocol is a set of rules that computers follow when they talk to each other, just like grammar rules help people communicate clearly.</p>
        
        <h4>🗣️ Real World Example:</h4>
        <p>When you answer the phone:</p>
        <ul>
          <li><strong>Step 1:</strong> You say "Hello?" (greeting protocol)</li>
          <li><strong>Step 2:</strong> Caller identifies themselves</li>
          <li><strong>Step 3:</strong> You have a conversation</li>
          <li><strong>Step 4:</strong> You say "Goodbye" and hang up</li>
        </ul>
        <p>Computers follow similar step-by-step rules!</p>
        
        <h4>📋 Common Internet Protocols:</h4>
        <ul>
          <li><strong>HTTP/HTTPS:</strong> Rules for web browsing</li>
          <li><strong>TCP:</strong> Rules for reliable data delivery</li>
          <li><strong>UDP:</strong> Rules for fast (but less reliable) data delivery</li>
          <li><strong>SMTP:</strong> Rules for sending emails</li>
          <li><strong>FTP:</strong> Rules for transferring files</li>
        </ul>
        
        <h4>🤝 Why Protocols Matter:</h4>
        <p>Without protocols, it would be like having a conversation where:</p>
        <ul>
          <li>One person speaks English, another speaks Chinese</li>
          <li>No one knows when it's their turn to talk</li>
          <li>People don't know how to start or end conversations</li>
        </ul>
        
        <h4>🌍 Universal Standards:</h4>
        <p>The amazing thing about internet protocols is that they work the same way everywhere in the world - a computer in Japan can talk to a computer in Brazil using the exact same rules!</p>
      </div>
    `
  },

  'Latency': {
    title: 'Network Latency',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> The delay between asking a question and getting an answer!</p>
        
        <p>Latency is how long it takes for data to travel from your device to a server and back. It's measured in milliseconds (ms) - thousandths of a second.</p>
        
        <h4>⏱️ Real World Example:</h4>
        <p>Imagine texting a friend:</p>
        <ul>
          <li><strong>Low Latency:</strong> They reply instantly (like being in the same room)</li>
          <li><strong>High Latency:</strong> They take 5 seconds to reply (like yelling across a football field)</li>
        </ul>
        
        <h4>📊 Latency Examples:</h4>
        <ul>
          <li><strong>1-30ms:</strong> Excellent (local servers, gaming)</li>
          <li><strong>30-50ms:</strong> Good (normal browsing)</li>
          <li><strong>50-100ms:</strong> Okay (noticeable in video calls)</li>
          <li><strong>100ms+:</strong> Frustrating (laggy gaming, buffering videos)</li>
        </ul>
        
        <h4>🌍 What Affects Latency:</h4>
        <ul>
          <li><strong>Distance:</strong> Data to nearby servers arrives faster</li>
          <li><strong>Connection Type:</strong> Fiber is faster than satellite</li>
          <li><strong>Network Traffic:</strong> Busy networks slow things down</li>
          <li><strong>Processing Time:</strong> Servers need time to think</li>
        </ul>
        
        <h4>🎮 Where You Notice It:</h4>
        <ul>
          <li><strong>Gaming:</strong> High latency = lag = losing the game!</li>
          <li><strong>Video Calls:</strong> Delays make conversations awkward</li>
          <li><strong>Web Browsing:</strong> Pages take longer to load</li>
        </ul>
        
        <h4>🚀 Speed of Light Limit:</h4>
        <p>Even at the speed of light, data takes about 67ms to travel halfway around Earth. That's why servers are placed close to users!</p>
      </div>
    `
  },

  'Bandwidth': {
    title: 'Network Bandwidth',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> The width of a highway - more lanes means more cars can travel at once!</p>
        
        <p>Bandwidth is how much data can be sent through your internet connection at the same time. It's measured in bits per second (bps), usually Megabits (Mbps) or Gigabits (Gbps).</p>
        
        <h4>🛣️ Real World Example:</h4>
        <ul>
          <li><strong>1-lane road:</strong> Only one car at a time (low bandwidth)</li>
          <li><strong>4-lane highway:</strong> Four cars side by side (medium bandwidth)</li>
          <li><strong>12-lane superhighway:</strong> Lots of cars at once (high bandwidth)</li>
        </ul>
        
        <h4>📊 Common Bandwidth Speeds:</h4>
        <ul>
          <li><strong>1-5 Mbps:</strong> Basic web browsing, email</li>
          <li><strong>25 Mbps:</strong> HD video streaming (Netflix standard)</li>
          <li><strong>100 Mbps:</strong> Multiple devices, 4K streaming</li>
          <li><strong>1 Gbps:</strong> Super fast downloads, many users</li>
        </ul>
        
        <h4>📺 Bandwidth vs. Latency:</h4>
        <p>Think of delivering pizza:</p>
        <ul>
          <li><strong>Latency:</strong> How long it takes the pizza to arrive</li>
          <li><strong>Bandwidth:</strong> How many pizzas can be delivered at once</li>
        </ul>
        <p>You can have fast delivery (low latency) but only deliver one pizza at a time (low bandwidth), or slow delivery (high latency) but deliver 20 pizzas at once (high bandwidth)!</p>
        
        <h4>📱 Sharing Bandwidth:</h4>
        <p>Your household bandwidth is shared among all devices. If your internet is 100 Mbps and 4 people are streaming Netflix, each gets about 25 Mbps.</p>
        
        <h4>⬆️⬇️ Download vs Upload:</h4>
        <ul>
          <li><strong>Download:</strong> Data coming to you (watching videos, loading websites)</li>
          <li><strong>Upload:</strong> Data going from you (posting photos, video calls)</li>
        </ul>
        <p>Most home internet has much faster download than upload speeds!</p>
      </div>
    `
  },

  'Firewall': {
    title: 'Firewall',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A security guard at a building entrance!</p>
        
        <p>A firewall examines all data coming into and going out of your network, blocking anything that looks suspicious or dangerous.</p>
        
        <h4>🏢 Real World Example:</h4>
        <p>Imagine a fancy hotel with a security guard:</p>
        <ul>
          <li><strong>Guests with reservations:</strong> Welcome! Come on in!</li>
          <li><strong>Known troublemakers:</strong> Sorry, you're on the banned list</li>
          <li><strong>Suspicious people:</strong> Can I see some ID please?</li>
          <li><strong>Delivery trucks:</strong> Okay, but only through the service entrance</li>
        </ul>
        
        <h4>🛡️ What Firewalls Block:</h4>
        <ul>
          <li><strong>Malware:</strong> Viruses trying to sneak in</li>
          <li><strong>Hackers:</strong> People trying to break into your network</li>
          <li><strong>Spam:</strong> Unwanted junk data</li>
          <li><strong>Unauthorized Access:</strong> Programs trying to phone home</li>
        </ul>
        
        <h4>🏠 Types of Firewalls:</h4>
        <ul>
          <li><strong>Router Firewall:</strong> Protects your whole home network</li>
          <li><strong>Computer Firewall:</strong> Windows Defender, built into your OS</li>
          <li><strong>Network Firewall:</strong> Big ones that protect entire companies</li>
        </ul>
        
        <h4>🚦 How Firewalls Decide:</h4>
        <ul>
          <li><strong>Port Blocking:</strong> Only certain "doors" are open</li>
          <li><strong>IP Address Lists:</strong> Known good and bad addresses</li>
          <li><strong>Pattern Recognition:</strong> Spotting suspicious behavior</li>
          <li><strong>Application Control:</strong> Only approved programs can connect</li>
        </ul>
        
        <h4>⚖️ The Balance:</h4>
        <p>Firewalls must balance security and convenience - too strict and nothing works, too loose and bad stuff gets through!</p>
      </div>
    `
  },

  'CDN': {
    title: 'CDN (Content Delivery Network)',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Having copies of your favorite store in every city!</p>
        
        <p>A CDN stores copies of websites and files on servers all around the world, so you can always get content from a server close to you.</p>
        
        <h4>🏪 Real World Example:</h4>
        <p>Instead of having one McDonald's in Chicago that everyone has to drive to:</p>
        <ul>
          <li><strong>Without CDN:</strong> Everyone drives to Chicago (slow, crowded)</li>
          <li><strong>With CDN:</strong> McDonald's in every city (fast, convenient)</li>
        </ul>
        <p>CDNs put copies of websites in many "internet cities" around the world!</p>
        
        <h4>🌍 How CDNs Work:</h4>
        <ol>
          <li>You request a YouTube video</li>
          <li>CDN finds the copy closest to you</li>
          <li>Nearby server sends you the video (super fast!)</li>
          <li>If it's not cached nearby, it gets it from the main server</li>
        </ol>
        
        <h4>📱 What Gets CDN'd:</h4>
        <ul>
          <li><strong>Images:</strong> Photos on websites load faster</li>
          <li><strong>Videos:</strong> YouTube, Netflix, TikTok</li>
          <li><strong>Software:</strong> App updates, game downloads</li>
          <li><strong>Web Files:</strong> CSS, JavaScript, fonts</li>
        </ul>
        
        <h4>🚀 Benefits:</h4>
        <ul>
          <li><strong>Speed:</strong> Content loads much faster</li>
          <li><strong>Reliability:</strong> If one server fails, others work</li>
          <li><strong>Less Traffic:</strong> Reduces load on main servers</li>
          <li><strong>Better Experience:</strong> Videos don't buffer as much</li>
        </ul>
        
        <h4>🏢 Famous CDNs:</h4>
        <ul>
          <li><strong>Cloudflare:</strong> Protects and speeds up websites</li>
          <li><strong>Amazon CloudFront:</strong> Part of AWS</li>
          <li><strong>Google CDN:</strong> Powers YouTube and other Google services</li>
        </ul>
      </div>
    `
  },

  'NAT': {
    title: 'NAT (Network Address Translation)',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A receptionist managing mail for an office building!</p>
        
        <p>NAT allows multiple devices in your home to share one public IP address by translating between private (home) addresses and public (internet) addresses.</p>
        
        <h4>🏢 Real World Example:</h4>
        <p>Your home is like an office building:</p>
        <ul>
          <li><strong>Building Address:</strong> 123 Main Street (your public IP)</li>
          <li><strong>Office Numbers:</strong> Suite 101, 102, 103 (your devices' private IPs)</li>
          <li><strong>Receptionist:</strong> Your router doing NAT</li>
        </ul>
        
        <h4>📬 How NAT Works:</h4>
        <p><strong>Outgoing Mail (Your Request):</strong></p>
        <ol>
          <li>Your laptop (Suite 101) wants to visit Google</li>
          <li>Router changes the return address from "Suite 101" to "123 Main Street"</li>
          <li>Remembers: "Suite 101 is waiting for a Google response"</li>
          <li>Sends request to Google</li>
        </ol>
        
        <p><strong>Incoming Mail (Google's Response):</strong></p>
        <ol>
          <li>Google sends response to "123 Main Street"</li>
          <li>Router checks notes: "Oh, this Google response goes to Suite 101"</li>
          <li>Delivers response to your laptop</li>
        </ol>
        
        <h4>🏠 Private IP Ranges:</h4>
        <ul>
          <li><strong>192.168.x.x:</strong> Most common home networks</li>
          <li><strong>10.x.x.x:</strong> Larger private networks</li>
          <li><strong>172.16.x.x - 172.31.x.x:</strong> Medium private networks</li>
        </ul>
        
        <h4>🛡️ Security Bonus:</h4>
        <p>NAT provides extra security because outside computers can't directly reach your devices - they have to go through your router first!</p>
        
        <h4>🌐 Why NAT Exists:</h4>
        <p>There aren't enough public IP addresses for every device in the world, so NAT lets thousands of devices share one public IP address!</p>
      </div>
    `
  },

  'TTL': {
    title: 'TTL (Time To Live)',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A countdown timer on a treasure map that self-destructs!</p>
        
        <p>TTL is a number that decreases by 1 each time a packet passes through a router. When it reaches 0, the packet is destroyed to prevent it from wandering the internet forever.</p>
        
        <h4>🗺️ Real World Example:</h4>
        <p>Imagine a message in a bottle with instructions:</p>
        <ul>
          <li><strong>"Pass this along 20 times, then destroy it"</strong></li>
          <li>Person 1 reads it, crosses out 20, writes 19, passes it on</li>
          <li>Person 2 reads it, crosses out 19, writes 18, passes it on</li>
          <li>When it reaches 0, the last person throws the bottle away</li>
        </ul>
        
        <h4>🔄 Why TTL Exists:</h4>
        <p>Without TTL, packets could get stuck in loops:</p>
        <ul>
          <li>Router A: "I'll send this to Router B"</li>
          <li>Router B: "I'll send this to Router C"</li>
          <li>Router C: "I'll send this back to Router A"</li>
          <li>Forever and ever... 🔄</li>
        </ul>
        
        <h4>📊 Typical TTL Values:</h4>
        <ul>
          <li><strong>64:</strong> Linux/Mac computers</li>
          <li><strong>128:</strong> Windows computers</li>
          <li><strong>255:</strong> Some network equipment</li>
          <li><strong>30:</strong> Usually enough to reach anywhere on Earth</li>
        </ul>
        
        <h4>🛠️ Practical Uses:</h4>
        <ul>
          <li><strong>Traceroute:</strong> Shows the path by watching TTL decrease</li>
          <li><strong>Network Diagnostics:</strong> Helps find routing problems</li>
          <li><strong>Loop Prevention:</strong> Stops packets from circling forever</li>
        </ul>
        
        <h4>⚠️ TTL Exceeded:</h4>
        <p>If a packet's TTL reaches 0, the router sends back an error message: "Sorry, this packet got lost and timed out!" This actually helps diagnose network problems!</p>
      </div>
    `
  },

  'Default Gateway': {
    title: 'Default Gateway',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> The exit door from your home to the outside world!</p>
        
        <p>Your default gateway is the router that connects your local network to the internet. When your device doesn't know where to send data, it sends it to the default gateway.</p>
        
        <h4>🏠 Real World Example:</h4>
        <p>Your home has many rooms, but only one front door to the street. The default gateway is like that front door - it's how you get to anywhere outside your house!</p>
        
        <h4>🎯 How It Works:</h4>
        <ul>
          <li>Your computer wants to visit google.com</li>
          <li>It thinks: "Google isn't in my house (local network)"</li>
          <li>So it sends the request to the default gateway (your router)</li>
          <li>Your router then forwards it to the internet</li>
        </ul>
        
        <h4>📍 Common Gateway Addresses:</h4>
        <ul>
          <li><strong>192.168.1.1:</strong> Most home routers</li>
          <li><strong>192.168.0.1:</strong> Some home routers</li>
          <li><strong>10.0.0.1:</strong> Some business networks</li>
        </ul>
      </div>
    `
  },

  'Subnet Mask': {
    title: 'Subnet Mask',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A map that shows which addresses are in your neighborhood!</p>
        
        <p>A subnet mask helps your computer figure out if another device is on the same local network or somewhere else on the internet.</p>
        
        <h4>🏘️ Real World Example:</h4>
        <p>All houses on your street have the same zip code. The subnet mask is like knowing your zip code - it tells you who's a neighbor (same network) vs who lives far away (different network).</p>
        
        <h4>🎯 How It Works:</h4>
        <ul>
          <li>Your IP: 192.168.1.100</li>
          <li>Subnet mask: 255.255.255.0</li>
          <li>This means addresses 192.168.1.1-254 are your "neighbors"</li>
          <li>Anything else needs to go through the gateway</li>
        </ul>
        
        <h4>📊 Common Subnet Masks:</h4>
        <ul>
          <li><strong>255.255.255.0:</strong> 254 addresses in your network</li>
          <li><strong>255.255.0.0:</strong> 65,534 addresses in your network</li>
          <li><strong>255.0.0.0:</strong> Millions of addresses in your network</li>
        </ul>
      </div>
    `
  },

  'Local Routing Table': {
    title: 'Local Routing Table',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Your personal GPS that knows the best routes from your house!</p>
        
        <p>A local routing table is a list stored on your device that tells it where to send different types of network traffic.</p>
        
        <h4>🗺️ Real World Example:</h4>
        <p>It's like having directions posted on your wall:</p>
        <ul>
          <li>"To visit neighbors: walk directly"</li>
          <li>"To go downtown: take Main Street to the highway"</li>
          <li>"To go anywhere else: drive to the highway entrance"</li>
        </ul>
        
        <h4>📋 What's In The Table:</h4>
        <ul>
          <li><strong>Local network:</strong> Send directly to device</li>
          <li><strong>Default route:</strong> Send to gateway router</li>
          <li><strong>Special routes:</strong> Custom paths for specific destinations</li>
        </ul>
        
        <h4>⚡ Why It's Important:</h4>
        <p>Without a routing table, your computer wouldn't know whether to talk to your printer directly or try to send the print job through the internet!</p>
      </div>
    `
  },

  'Public vs Private IP': {
    title: 'Public vs Private IP Addresses',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Your home address vs your apartment number!</p>
        
        <h4>🏢 Public IP (Building Address):</h4>
        <ul>
          <li>Unique address on the internet</li>
          <li>Like "123 Main Street" - everyone knows where this is</li>
          <li>Your ISP gives you one public IP for your whole house</li>
          <li>Visible to the entire internet</li>
        </ul>
        
        <h4>🏠 Private IP (Apartment Number):</h4>
        <ul>
          <li>Only used inside your local network</li>
          <li>Like "Apartment 2B" - only makes sense inside the building</li>
          <li>Your router assigns these to each device</li>
          <li>Not directly accessible from the internet</li>
        </ul>
        
        <h4>🔗 How They Work Together:</h4>
        <p>Your router uses NAT to translate between them - like a receptionist who takes mail addressed to "123 Main Street" and delivers it to "Apartment 2B".</p>
        
        <h4>📍 Private IP Ranges:</h4>
        <ul>
          <li><strong>192.168.x.x:</strong> Most home networks</li>
          <li><strong>10.x.x.x:</strong> Large private networks</li>
          <li><strong>172.16.x.x - 172.31.x.x:</strong> Medium private networks</li>
        </ul>
      </div>
    `
  },

  'Port Translation': {
    title: 'Port Translation',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A receptionist managing phone extensions!</p>
        
        <p>Port translation happens when your router changes the port numbers on outgoing packets and remembers which device each port belongs to.</p>
        
        <h4>📞 Real World Example:</h4>
        <p>Your office has one main phone number, but multiple extensions:</p>
        <ul>
          <li>Outside calls to (555) 123-4567 ext 101 → John's desk</li>
          <li>Outside calls to (555) 123-4567 ext 102 → Sarah's desk</li>
          <li>The receptionist manages which extension goes where</li>
        </ul>
        
        <h4>🔄 How It Works:</h4>
        <ul>
          <li>Your laptop (port 3000) wants to visit a website</li>
          <li>Router changes it to port 12345 and remembers: "12345 = laptop"</li>
          <li>Website responds to your router's port 12345</li>
          <li>Router sees 12345 and forwards it back to your laptop</li>
        </ul>
        
        <h4>🎯 Why It's Needed:</h4>
        <p>Multiple devices in your home might use the same port number, so the router creates unique external port numbers to keep track of which device gets which response!</p>
      </div>
    `
  },

  'BGP (Border Gateway Protocol)': {
    title: 'BGP (Border Gateway Protocol)',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> International diplomats agreeing on trade routes!</p>
        
        <p>BGP is the protocol that different internet providers use to share information about the best paths to reach different parts of the internet.</p>
        
        <h4>🌍 Real World Example:</h4>
        <p>Imagine shipping companies around the world:</p>
        <ul>
          <li>FedEx tells UPS: "I can deliver to Europe in 2 days"</li>
          <li>UPS tells DHL: "I can reach Asia through the Pacific route"</li>
          <li>Each company shares their best routes with others</li>
          <li>When you ship a package, they pick the fastest route</li>
        </ul>
        
        <h4>🤝 How ISPs Use BGP:</h4>
        <ul>
          <li>Comcast tells Verizon: "I can reach Netflix's servers efficiently"</li>
          <li>Verizon tells AT&T: "Route European traffic through me"</li>
          <li>They constantly update each other about the best paths</li>
        </ul>
        
        <h4>⚡ Why It Matters:</h4>
        <p>BGP ensures your data takes the fastest, most reliable path across the internet, automatically routing around outages and congestion!</p>
      </div>
    `
  },

  'Autonomous Systems': {
    title: 'Autonomous Systems (AS)',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Different countries with their own postal systems!</p>
        
        <p>An Autonomous System is a network controlled by a single organization (like an ISP or big company) that has its own routing policies.</p>
        
        <h4>🏛️ Real World Example:</h4>
        <ul>
          <li><strong>USA Postal Service:</strong> Handles all mail within the US</li>
          <li><strong>Canada Post:</strong> Handles all mail within Canada</li>
          <li><strong>Between countries:</strong> They coordinate to exchange international mail</li>
        </ul>
        
        <h4>🌐 Internet Examples:</h4>
        <ul>
          <li><strong>AS7922:</strong> Comcast's network</li>
          <li><strong>AS15169:</strong> Google's network</li>
          <li><strong>AS32934:</strong> Facebook's network</li>
          <li><strong>AS701:</strong> Verizon's network</li>
        </ul>
        
        <h4>🤝 How They Connect:</h4>
        <p>Just like countries have treaties for mail exchange, Autonomous Systems have agreements (called peering) to exchange internet traffic with each other.</p>
        
        <h4>📊 Fun Fact:</h4>
        <p>There are about 100,000 Autonomous Systems worldwide, ranging from huge ISPs to small companies with their own network blocks!</p>
      </div>
    `
  },

  'Internet Routing': {
    title: 'Internet Routing',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A global GPS system for data packets!</p>
        
        <p>Internet routing is how data finds its way across the world's networks, with routers constantly sharing information about the best paths.</p>
        
        <h4>🗺️ Real World Example:</h4>
        <p>Imagine a worldwide delivery network:</p>
        <ul>
          <li>Package needs to go from New York to Tokyo</li>
          <li>Route options: Through London, through Los Angeles, through Moscow</li>
          <li>Delivery hubs constantly share: "My route is faster/cheaper/more reliable"</li>
          <li>Package automatically takes the best available route</li>
        </ul>
        
        <h4>🔄 How It Works:</h4>
        <ul>
          <li>Routers constantly share routing information</li>
          <li>Each router knows the "next hop" for different destinations</li>
          <li>If a route fails, traffic automatically reroutes</li>
          <li>Multiple paths exist for redundancy</li>
        </ul>
        
        <h4>⚡ Smart Features:</h4>
        <ul>
          <li><strong>Load Balancing:</strong> Spreads traffic across multiple paths</li>
          <li><strong>Fault Tolerance:</strong> Automatically routes around failures</li>
          <li><strong>Optimization:</strong> Prefers faster, less congested routes</li>
        </ul>
      </div>
    `
  },

  'Longest Prefix Match': {
    title: 'Longest Prefix Match',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Finding the most specific address match!</p>
        
        <p>When a router has multiple possible routes to a destination, it picks the most specific (longest prefix) match.</p>
        
        <h4>📮 Real World Example:</h4>
        <p>Imagine sorting mail:</p>
        <ul>
          <li><strong>Route 1:</strong> "All of California" → West Coast facility</li>
          <li><strong>Route 2:</strong> "Los Angeles area" → LA facility</li>
          <li><strong>Route 3:</strong> "Downtown LA" → Downtown office</li>
        </ul>
        <p>For mail to "Downtown LA," you'd pick Route 3 (most specific match), not Route 1 (too general).</p>
        
        <h4>🎯 Router Example:</h4>
        <ul>
          <li><strong>Route 1:</strong> 192.168.0.0/16 → Router A (65,536 addresses)</li>
          <li><strong>Route 2:</strong> 192.168.1.0/24 → Router B (256 addresses)</li>
          <li><strong>Route 3:</strong> 192.168.1.100/32 → Router C (1 specific address)</li>
        </ul>
        <p>For traffic to 192.168.1.100, the router picks Route 3 (most specific).</p>
        
        <h4>⚡ Why It Matters:</h4>
        <p>This ensures traffic goes to the most appropriate, specific destination rather than taking a generic, potentially inefficient route!</p>
      </div>
    `
  },

  'Internet Backbone': {
    title: 'Internet Backbone',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> The interstate highway system for data!</p>
        
        <p>The internet backbone consists of high-speed data lines that connect major cities and countries, carrying massive amounts of internet traffic.</p>
        
        <h4>🛣️ Real World Example:</h4>
        <ul>
          <li><strong>Interstate Highways:</strong> Connect major cities (like I-95, I-10)</li>
          <li><strong>State Roads:</strong> Connect smaller cities to interstates</li>
          <li><strong>Local Streets:</strong> Connect your house to state roads</li>
          <li><strong>Internet Backbone:</strong> The "interstate highways" of the internet</li>
        </ul>
        
        <h4>🌊 Physical Infrastructure:</h4>
        <ul>
          <li><strong>Undersea Cables:</strong> Connect continents across oceans</li>
          <li><strong>Fiber Optic Lines:</strong> High-speed connections between cities</li>
          <li><strong>Satellite Links:</strong> Reach remote areas</li>
          <li><strong>Data Centers:</strong> Major traffic exchange points</li>
        </ul>
        
        <h4>⚡ Speed & Scale:</h4>
        <ul>
          <li><strong>Capacity:</strong> Terabits per second (thousands of Gigabits)</li>
          <li><strong>Distance:</strong> Thousands of miles of cables</li>
          <li><strong>Redundancy:</strong> Multiple paths for reliability</li>
        </ul>
        
        <h4>🏢 Who Owns It:</h4>
        <p>Major telecom companies, internet providers, and tech giants like AT&T, Level 3, Google, and Amazon own different parts of the backbone infrastructure.</p>
      </div>
    `
  },

  'DNS Resolution': {
    title: 'DNS Resolution',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Looking up a phone number in multiple phone books!</p>
        
        <p>DNS resolution is the process of translating a website name (like google.com) into an IP address that computers can use.</p>
        
        <h4>📞 Real World Example:</h4>
        <p>You want to call "Pizza Palace" but need their phone number:</p>
        <ol>
          <li>Check your personal contacts (DNS cache)</li>
          <li>Ask your friend (local DNS server)</li>
          <li>Call directory assistance (root DNS servers)</li>
          <li>They transfer you to the local directory (authoritative DNS)</li>
          <li>Get the number and make the call!</li>
        </ol>
        
        <h4>🔍 DNS Resolution Steps:</h4>
        <ol>
          <li><strong>Check Cache:</strong> "Do I already know google.com's address?"</li>
          <li><strong>Ask Recursive Resolver:</strong> Your ISP's DNS server</li>
          <li><strong>Query Root Servers:</strong> "Who handles .com domains?"</li>
          <li><strong>Query TLD Servers:</strong> "Who handles google.com?"</li>
          <li><strong>Query Authoritative:</strong> "What's google.com's IP address?"</li>
          <li><strong>Return Answer:</strong> "It's 172.217.164.110!"</li>
        </ol>
        
        <h4>⚡ Speed Optimizations:</h4>
        <ul>
          <li><strong>Caching:</strong> Remembers recent lookups</li>
          <li><strong>TTL:</strong> How long to remember each answer</li>
          <li><strong>Multiple Servers:</strong> Faster response times</li>
        </ul>
      </div>
    `
  },

  'Anycast Routing': {
    title: 'Anycast Routing',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Multiple 911 call centers with the same phone number!</p>
        
        <p>Anycast allows multiple servers in different locations to share the same IP address, with traffic automatically going to the closest one.</p>
        
        <h4>🚨 Real World Example:</h4>
        <p>When you dial 911:</p>
        <ul>
          <li>There are many 911 call centers across the country</li>
          <li>All use the same "phone number" (911)</li>
          <li>Your call automatically goes to the closest center</li>
          <li>If one is busy, it routes to the next closest</li>
        </ul>
        
        <h4>🌐 How DNS Uses Anycast:</h4>
        <ul>
          <li>Google's DNS (8.8.8.8) has servers worldwide</li>
          <li>All servers use the same IP address</li>
          <li>Your request goes to the geographically closest server</li>
          <li>Faster response = faster website loading</li>
        </ul>
        
        <h4>⚡ Benefits:</h4>
        <ul>
          <li><strong>Speed:</strong> Always connects to the nearest server</li>
          <li><strong>Reliability:</strong> If one server fails, traffic goes elsewhere</li>
          <li><strong>Load Distribution:</strong> Spreads traffic across multiple servers</li>
        </ul>
        
        <h4>📍 Common Anycast Services:</h4>
        <p>DNS servers, CDNs, and DDoS protection services commonly use anycast routing for better performance and reliability.</p>
      </div>
    `
  },

  'CDN Edge Servers': {
    title: 'CDN Edge Servers',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Having a convenience store on every corner!</p>
        
        <p>CDN edge servers are copies of popular content placed close to users around the world, so you don't have to travel far to get what you need.</p>
        
        <h4>🏪 Real World Example:</h4>
        <p>Instead of driving 50 miles to the main Walmart distribution center for milk:</p>
        <ul>
          <li>There's a local store 2 blocks away with the same milk</li>
          <li>Much faster to get what you need</li>
          <li>Less traffic on the highways to the main warehouse</li>
          <li>If the local store is out, you can try the next closest one</li>
        </ul>
        
        <h4>📱 How CDN Edge Servers Work:</h4>
        <ul>
          <li>Netflix stores popular movies on servers in your city</li>
          <li>When you click play, it comes from nearby (super fast!)</li>
          <li>No need to download from California to New York</li>
          <li>Reduces buffering and improves quality</li>
        </ul>
        
        <h4>🎯 What Gets Cached:</h4>
        <ul>
          <li><strong>Videos:</strong> YouTube, Netflix, TikTok content</li>
          <li><strong>Images:</strong> Photos on websites and social media</li>
          <li><strong>Software:</strong> App updates, game downloads</li>
          <li><strong>Web Files:</strong> CSS, JavaScript, fonts</li>
        </ul>
        
        <h4>🌍 Global Network:</h4>
        <p>Major CDNs have thousands of edge servers worldwide - there's probably one within 50 miles of you right now!</p>
      </div>
    `
  },

  'Multi-hop Forwarding': {
    title: 'Multi-hop Forwarding',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A relay race where runners pass the baton!</p>
        
        <p>Multi-hop forwarding is when data packets travel through multiple routers to reach their destination, with each router forwarding the packet to the next best router.</p>
        
        <h4>🏃‍♂️ Real World Example:</h4>
        <p>Imagine a cross-country relay race:</p>
        <ul>
          <li>Runner 1: New York to Philadelphia</li>
          <li>Runner 2: Philadelphia to Pittsburgh</li>
          <li>Runner 3: Pittsburgh to Chicago</li>
          <li>Each runner only knows the next runner, not the final destination</li>
        </ul>
        
        <h4>📦 How Packets Hop:</h4>
        <ol>
          <li>Your computer sends packet to home router</li>
          <li>Home router forwards to ISP router</li>
          <li>ISP router forwards to internet backbone</li>
          <li>Backbone router forwards toward destination</li>
          <li>Process continues until packet arrives</li>
        </ol>
        
        <h4>🎯 Each Hop Decides:</h4>
        <ul>
          <li>Which is the best next router?</li>
          <li>Is the destination directly connected?</li>
          <li>Should I use a backup route?</li>
        </ul>
        
        <h4>⚡ Why Multiple Hops:</h4>
        <p>No single router can connect to every destination, so packets "hop" through the network, with each router getting them closer to their target!</p>
      </div>
    `
  },

  'Specialized Infrastructure': {
    title: 'Specialized Infrastructure',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Different types of roads for different types of vehicles!</p>
        
        <p>Specialized infrastructure refers to network equipment and connections designed for specific purposes, like high-speed backbone links or secure government networks.</p>
        
        <h4>🛣️ Real World Example:</h4>
        <ul>
          <li><strong>Regular Roads:</strong> For everyday cars</li>
          <li><strong>Highways:</strong> For faster, long-distance travel</li>
          <li><strong>Rail Lines:</strong> For heavy cargo</li>
          <li><strong>Airport Runways:</strong> For airplanes only</li>
        </ul>
        
        <h4>🌐 Internet Infrastructure Types:</h4>
        <ul>
          <li><strong>Consumer Internet:</strong> Your home broadband</li>
          <li><strong>Business Lines:</strong> Dedicated, guaranteed speeds</li>
          <li><strong>Backbone Networks:</strong> Ultra-high-speed inter-city connections</li>
          <li><strong>Submarine Cables:</strong> Cross-ocean fiber optic lines</li>
          <li><strong>Satellite Networks:</strong> For remote areas</li>
        </ul>
        
        <h4>⚡ Special Features:</h4>
        <ul>
          <li><strong>Higher Capacity:</strong> Handle massive amounts of data</li>
          <li><strong>Lower Latency:</strong> Optimized for speed</li>
          <li><strong>Better Reliability:</strong> Redundant connections</li>
          <li><strong>Priority Handling:</strong> Important traffic gets priority</li>
        </ul>
      </div>
    `
  },

  'A Record Resolution': {
    title: 'A Record Resolution',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Looking up someone's street address in a phone book!</p>
        
        <p>An A Record (Address Record) is a DNS entry that directly maps a domain name to an IPv4 address.</p>
        
        <h4>📞 Real World Example:</h4>
        <p>In a phone book:</p>
        <ul>
          <li><strong>Name:</strong> "Joe's Pizza"</li>
          <li><strong>Address:</strong> "123 Main Street"</li>
          <li>The A Record is like this direct name-to-address mapping</li>
        </ul>
        
        <h4>💻 DNS A Record Example:</h4>
        <ul>
          <li><strong>Domain:</strong> google.com</li>
          <li><strong>A Record:</strong> 172.217.164.110</li>
          <li>When you type "google.com", DNS returns this IP address</li>
        </ul>
        
        <h4>🔍 Resolution Process:</h4>
        <ol>
          <li>You type "example.com" in browser</li>
          <li>DNS lookup finds the A record</li>
          <li>Returns the IP address (like 93.184.216.34)</li>
          <li>Browser connects to that IP address</li>
        </ol>
        
        <h4>📊 Other Record Types:</h4>
        <ul>
          <li><strong>A Record:</strong> IPv4 address (most common)</li>
          <li><strong>AAAA Record:</strong> IPv6 address</li>
          <li><strong>CNAME:</strong> Points to another domain name</li>
          <li><strong>MX Record:</strong> Mail server information</li>
        </ul>
      </div>
    `
  },

  'Reverse Path Routing': {
    title: 'Reverse Path Routing',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Finding your way back home using breadcrumbs!</p>
        
        <p>Reverse path routing ensures that response packets can find their way back to the original sender by following the reverse path.</p>
        
        <h4>🍞 Real World Example:</h4>
        <p>Hansel and Gretel dropping breadcrumbs:</p>
        <ul>
          <li>They drop breadcrumbs on their way TO the witch's house</li>
          <li>To get back home, they follow the breadcrumbs in reverse</li>
          <li>Each breadcrumb shows the way back to the previous step</li>
        </ul>
        
        <h4>📦 How It Works with Packets:</h4>
        <ol>
          <li>Your request packet travels: You → Router A → Router B → Server</li>
          <li>Each router remembers where the packet came from</li>
          <li>Server's response follows the reverse path: Server → Router B → Router A → You</li>
        </ol>
        
        <h4>🔄 Why It's Important:</h4>
        <ul>
          <li><strong>Ensures Delivery:</strong> Responses find their way back</li>
          <li><strong>Maintains Sessions:</strong> Keeps conversations connected</li>
          <li><strong>Network Efficiency:</strong> Uses already-established paths</li>
        </ul>
        
        <h4>🛡️ Security Benefit:</h4>
        <p>Routers can verify that packets are coming from expected directions, helping prevent certain types of network attacks!</p>
      </div>
    `
  },

  'BGP Path Selection': {
    title: 'BGP Path Selection',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Choosing the best route on a GPS with multiple options!</p>
        
        <p>BGP Path Selection is how routers decide which route to use when there are multiple possible paths to the same destination.</p>
        
        <h4>🗺️ Real World Example:</h4>
        <p>Your GPS shows 3 routes to work:</p>
        <ul>
          <li><strong>Route 1:</strong> Highway (usually fastest)</li>
          <li><strong>Route 2:</strong> Back roads (longer but reliable)</li>
          <li><strong>Route 3:</strong> City streets (shortest distance)</li>
        </ul>
        <p>BGP has similar decision criteria!</p>
        
        <h4>🎯 BGP Selection Criteria (in order):</h4>
        <ol>
          <li><strong>Weight:</strong> Locally configured preference</li>
          <li><strong>Local Preference:</strong> Internal priority</li>
          <li><strong>Locally Originated:</strong> Prefer own routes</li>
          <li><strong>AS Path Length:</strong> Shorter path wins</li>
          <li><strong>Origin Type:</strong> How the route was learned</li>
          <li><strong>MED:</strong> External metric from neighbor</li>
          <li><strong>Neighbor Type:</strong> Prefer external over internal</li>
          <li><strong>IGP Metric:</strong> Internal routing cost</li>
        </ol>
        
        <h4>⚡ Smart Decisions:</h4>
        <ul>
          <li><strong>Prefer customers over peers</strong> (more revenue)</li>
          <li><strong>Avoid congested links</strong> (better performance)</li>
          <li><strong>Choose shorter paths</strong> (lower latency)</li>
        </ul>
      </div>
    `
  },

  'Customer IP Assignment': {
    title: 'Customer IP Assignment',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A landlord assigning apartment numbers to tenants!</p>
        
        <p>ISPs assign IP addresses to their customers, managing blocks of addresses and routing traffic to the right customer.</p>
        
        <h4>🏢 Real World Example:</h4>
        <p>An apartment building owner:</p>
        <ul>
          <li>Owns the building address: "123 Main Street"</li>
          <li>Assigns apartment numbers: 101, 102, 103...</li>
          <li>Mail comes to "123 Main Street" and gets sorted to apartments</li>
          <li>Landlord manages who lives in which apartment</li>
        </ul>
        
        <h4>🌐 How ISPs Assign IPs:</h4>
        <ul>
          <li><strong>ISP owns:</strong> Large block like 203.0.113.0/24 (256 addresses)</li>
          <li><strong>Home customers:</strong> Get 1 public IP (like 203.0.113.100)</li>
          <li><strong>Business customers:</strong> Might get multiple IPs or a subnet</li>
          <li><strong>Dynamic vs Static:</strong> Address changes vs stays the same</li>
        </ul>
        
        <h4>📋 Types of Assignment:</h4>
        <ul>
          <li><strong>DHCP:</strong> Automatic temporary assignment</li>
          <li><strong>Static:</strong> Permanent, manually configured</li>
          <li><strong>PPPoE:</strong> Dial-up style authentication</li>
        </ul>
        
        <h4>🔄 Address Management:</h4>
        <p>ISPs carefully track which customer has which IP address to ensure internet traffic gets delivered to the right place!</p>
      </div>
    `
  },

  'Last Mile Delivery': {
    title: 'Last Mile Delivery',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> The final step of package delivery to your front door!</p>
        
        <p>Last mile delivery in networking is the final connection from your ISP's infrastructure to your home or business.</p>
        
        <h4>📦 Real World Example:</h4>
        <p>Package delivery process:</p>
        <ul>
          <li><strong>Warehouse to airplane:</strong> Long-distance transport</li>
          <li><strong>Airplane to regional hub:</strong> Distribution</li>
          <li><strong>Hub to local post office:</strong> Local sorting</li>
          <li><strong>Post office to your house:</strong> LAST MILE DELIVERY</li>
        </ul>
        
        <h4>🏠 Internet Last Mile:</h4>
        <ul>
          <li><strong>Internet backbone:</strong> High-speed connections between cities</li>
          <li><strong>ISP regional network:</strong> City-wide distribution</li>
          <li><strong>Local ISP equipment:</strong> Neighborhood infrastructure</li>
          <li><strong>To your home:</strong> LAST MILE CONNECTION</li>
        </ul>
        
        <h4>🔌 Last Mile Technologies:</h4>
        <ul>
          <li><strong>Cable:</strong> Coaxial cable (shared with neighbors)</li>
          <li><strong>DSL:</strong> Phone lines (dedicated but slower)</li>
          <li><strong>Fiber:</strong> Fiber optic (fastest and most reliable)</li>
          <li><strong>Wireless:</strong> 5G, satellite (no cables needed)</li>
        </ul>
        
        <h4>💡 Why It's Important:</h4>
        <p>The last mile often determines your internet speed and reliability - it's usually the bottleneck between you and the ultra-fast internet backbone!</p>
      </div>
    `
  },

  'Reverse NAT': {
    title: 'Reverse NAT',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A receptionist delivering mail to the right office!</p>
        
        <p>Reverse NAT is when your router receives incoming packets and translates them back to the correct internal device and port.</p>
        
        <h4>📮 Real World Example:</h4>
        <p>Mail delivery to an office building:</p>
        <ul>
          <li>Mail arrives addressed to "123 Main Street" (public IP)</li>
          <li>Receptionist checks the tracking info: "This is for Suite 201"</li>
          <li>Delivers mail to the right office (internal device)</li>
          <li>Office worker receives their mail</li>
        </ul>
        
        <h4>🔄 How Reverse NAT Works:</h4>
        <ol>
          <li>Your laptop requests a website (outgoing NAT creates a mapping)</li>
          <li>Website responds to your router's public IP</li>
          <li>Router checks NAT table: "This response is for the laptop"</li>
          <li>Router changes destination to laptop's private IP</li>
          <li>Laptop receives the website response</li>
        </ol>
        
        <h4>📋 NAT Table Example:</h4>
        <ul>
          <li><strong>External:</strong> 203.0.113.1:12345 ↔ <strong>Internal:</strong> 192.168.1.100:3000</li>
          <li>Router remembers: "Port 12345 responses go to laptop port 3000"</li>
        </ul>
        
        <h4>⚡ Why It's Essential:</h4>
        <p>Without reverse NAT, your router wouldn't know which device requested what, and responses would get lost!</p>
      </div>
    `
  },

  'Stateful NAT Table': {
    title: 'Stateful NAT Table',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A receptionist's notebook tracking who called whom!</p>
        
        <p>A stateful NAT table remembers active connections and their state, ensuring that only legitimate response traffic is allowed back in.</p>
        
        <h4>📞 Real World Example:</h4>
        <p>Office receptionist's call log:</p>
        <ul>
          <li>"10:30 AM - John called Pizza Palace, waiting for callback"</li>
          <li>"10:35 AM - Pizza Palace calls back, transfer to John"</li>
          <li>"10:40 AM - Call ended, remove from log"</li>
        </ul>
        
        <h4>🗃️ What the NAT Table Tracks:</h4>
        <ul>
          <li><strong>Source:</strong> Which internal device made the request</li>
          <li><strong>Destination:</strong> Which external server they contacted</li>
          <li><strong>Ports:</strong> Internal and external port numbers</li>
          <li><strong>Protocol:</strong> TCP, UDP, etc.</li>
          <li><strong>State:</strong> Connection established, active, closing</li>
          <li><strong>Timeout:</strong> How long to remember this connection</li>
        </ul>
        
        <h4>🛡️ Security Benefits:</h4>
        <ul>
          <li><strong>Only Expected Traffic:</strong> Blocks unrequested incoming packets</li>
          <li><strong>Connection Tracking:</strong> Ensures responses match requests</li>
          <li><strong>Automatic Cleanup:</strong> Removes old, inactive connections</li>
        </ul>
        
        <h4>⏰ Timeout Management:</h4>
        <p>If a connection is idle too long, it's removed from the table - this prevents the table from filling up and provides security by blocking stale connections!</p>
      </div>
    `
  },

  'Session Tracking': {
    title: 'Session Tracking',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A waiter remembering your order and table number!</p>
        
        <p>Session tracking monitors active network connections, remembering the details of each conversation between devices.</p>
        
        <h4>🍽️ Real World Example:</h4>
        <p>Restaurant service:</p>
        <ul>
          <li><strong>You order:</strong> "Table 5 wants pizza and drinks"</li>
          <li><strong>Waiter tracks:</strong> Table 5, pizza order, drinks order</li>
          <li><strong>Kitchen delivers:</strong> Waiter knows it goes to Table 5</li>
          <li><strong>You finish:</strong> Waiter closes the session</li>
        </ul>
        
        <h4>💻 Network Session Example:</h4>
        <ul>
          <li><strong>Your laptop:</strong> Opens Netflix connection</li>
          <li><strong>Router tracks:</strong> Laptop → Netflix, video streaming session</li>
          <li><strong>Netflix responds:</strong> Router knows it's for your laptop</li>
          <li><strong>Session ends:</strong> Router cleans up the tracking info</li>
        </ul>
        
        <h4>📊 What Gets Tracked:</h4>
        <ul>
          <li><strong>Who:</strong> Source and destination devices</li>
          <li><strong>What:</strong> Type of connection (web, email, streaming)</li>
          <li><strong>When:</strong> Start time and last activity</li>
          <li><strong>How:</strong> Protocol and port numbers</li>
          <li><strong>State:</strong> Starting, active, closing</li>
        </ul>
        
        <h4>🛡️ Why It Matters:</h4>
        <p>Session tracking enables firewalls to make smart decisions about what traffic to allow, ensuring security while maintaining legitimate connections!</p>
      </div>
    `
  },

  'Local Delivery': {
    title: 'Local Delivery',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Mail being delivered within your neighborhood!</p>
        
        <p>Local delivery is when data packets are delivered directly to devices on the same local network without going through external routers.</p>
        
        <h4>🏘️ Real World Example:</h4>
        <ul>
          <li><strong>Neighbor to neighbor:</strong> Walk next door to borrow sugar</li>
          <li><strong>Same street delivery:</strong> Kids riding bikes to each other's houses</li>
          <li><strong>No postal service needed:</strong> Direct, local communication</li>
        </ul>
        
        <h4>🏠 Network Local Delivery:</h4>
        <ul>
          <li><strong>Same subnet:</strong> 192.168.1.100 to 192.168.1.101</li>
          <li><strong>Direct connection:</strong> Through the local switch/router</li>
          <li><strong>No internet needed:</strong> Stays within your home network</li>
        </ul>
        
        <h4>📱 Common Local Delivery Examples:</h4>
        <ul>
          <li><strong>Printing:</strong> Laptop to WiFi printer</li>
          <li><strong>File Sharing:</strong> Computer to computer on same network</li>
          <li><strong>Media Streaming:</strong> Phone to smart TV</li>
          <li><strong>Gaming:</strong> Local multiplayer games</li>
        </ul>
        
        <h4>⚡ Benefits:</h4>
        <ul>
          <li><strong>Fast:</strong> No internet delays</li>
          <li><strong>Private:</strong> Traffic doesn't leave your network</li>
          <li><strong>Reliable:</strong> Works even if internet is down</li>
          <li><strong>Free:</strong> No data usage from your ISP plan</li>
        </ul>
      </div>
    `
  },

  'Content Caching': {
    title: 'Content Caching',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Keeping snacks in your desk drawer for quick access!</p>
        
        <p>Content caching stores frequently accessed data closer to users so it can be delivered faster the next time it's needed.</p>
        
        <h4>🍪 Real World Example:</h4>
        <ul>
          <li>Instead of walking to the kitchen every time you want a snack</li>
          <li>You keep some cookies in your desk drawer</li>
          <li>When you want a cookie, it's right there (super fast!)</li>
          <li>When you run out, you restock from the kitchen</li>
        </ul>
        
        <h4>💻 How Caching Works:</h4>
        <ul>
          <li><strong>First visit:</strong> Download cat video from YouTube servers</li>
          <li><strong>Cache stores:</strong> Copy saved on local CDN server</li>
          <li><strong>Next viewer:</strong> Gets video from nearby cache (much faster!)</li>
          <li><strong>Cache refresh:</strong> Periodically updates content</li>
        </ul>
        
        <h4>📦 What Gets Cached:</h4>
        <ul>
          <li><strong>Popular videos:</strong> YouTube, TikTok, Netflix</li>
          <li><strong>Images:</strong> Photos, memes, profile pictures</li>
          <li><strong>Software:</strong> App updates, game downloads</li>
          <li><strong>Web pages:</strong> News sites, popular articles</li>
        </ul>
        
        <h4>⚡ Cache Benefits:</h4>
        <ul>
          <li><strong>Faster loading:</strong> Content comes from nearby</li>
          <li><strong>Less buffering:</strong> Videos start playing immediately</li>
          <li><strong>Reduced costs:</strong> Less bandwidth usage</li>
          <li><strong>Better experience:</strong> Websites feel more responsive</li>
        </ul>
      </div>
    `
  },

  'Distributed Denial of Service': {
    title: 'DDoS (Distributed Denial of Service)',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Thousands of people calling a restaurant at the same time!</p>
        
        <p>A DDoS attack overwhelms a website or service with so much fake traffic that real users can't get through.</p>
        
        <h4>📞 Real World Example:</h4>
        <p>Imagine a pizza restaurant that can handle 10 phone calls at once:</p>
        <ul>
          <li>Attackers organize 1000 people to call simultaneously</li>
          <li>All phone lines get jammed with fake orders</li>
          <li>Real customers can't get through to order pizza</li>
          <li>Restaurant business is disrupted even though nothing is broken</li>
        </ul>
        
        <h4>🌐 How DDoS Attacks Work:</h4>
        <ol>
          <li><strong>Target Selection:</strong> Pick a website to attack</li>
          <li><strong>Botnet Assembly:</strong> Use thousands of compromised computers</li>
          <li><strong>Coordinated Attack:</strong> All computers flood the target</li>
          <li><strong>Service Overwhelmed:</strong> Website can't handle the traffic</li>
          <li><strong>Legitimate Users Blocked:</strong> Real visitors can't access the site</li>
        </ol>
        
        <h4>🛡️ Common DDoS Defenses:</h4>
        <ul>
          <li><strong>Rate Limiting:</strong> Limit requests per IP address</li>
          <li><strong>Traffic Filtering:</strong> Block suspicious request patterns</li>
          <li><strong>Load Balancing:</strong> Distribute traffic across multiple servers</li>
          <li><strong>CDN Protection:</strong> Absorb attack traffic at edge servers</li>
        </ul>
        
        <h4>🎯 Why Attackers Do This:</h4>
        <p>Usually for extortion ("pay us or we'll keep attacking"), competition disruption, or just causing chaos. It's illegal in most countries!</p>
      </div>
    `
  },

  'Botnet Command & Control': {
    title: 'Botnet Command & Control',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> A criminal mastermind controlling an army of remote-controlled robots!</p>
        
        <p>Botnet Command & Control is how cybercriminals remotely control thousands of infected computers to carry out coordinated attacks.</p>
        
        <h4>🤖 Real World Example:</h4>
        <p>Imagine a villain with remote-controlled robots:</p>
        <ul>
          <li><strong>Step 1:</strong> Secretly plant remote controls in 10,000 robots</li>
          <li><strong>Step 2:</strong> Set up a command center</li>
          <li><strong>Step 3:</strong> Send signals: "All robots attack the bank!"</li>
          <li><strong>Step 4:</strong> Robots coordinate their attack simultaneously</li>
        </ul>
        
        <h4>💻 How Botnets Work:</h4>
        <ol>
          <li><strong>Infection:</strong> Malware secretly infects computers</li>
          <li><strong>Registration:</strong> Infected computers "phone home" to control server</li>
          <li><strong>Commands:</strong> Criminal sends instructions to all bots</li>
          <li><strong>Execution:</strong> All infected computers follow commands</li>
          <li><strong>Coordination:</strong> Massive synchronized attack</li>
        </ol>
        
        <h4>📡 Command Methods:</h4>
        <ul>
          <li><strong>IRC Channels:</strong> Chat rooms for bot coordination</li>
          <li><strong>HTTP Servers:</strong> Web-based command centers</li>
          <li><strong>P2P Networks:</strong> Distributed command structure</li>
          <li><strong>Social Media:</strong> Hidden commands in posts/messages</li>
        </ul>
        
        <h4>🛡️ Protection:</h4>
        <ul>
          <li><strong>Antivirus Software:</strong> Detect and remove bot malware</li>
          <li><strong>Firewall Rules:</strong> Block suspicious outbound connections</li>
          <li><strong>Regular Updates:</strong> Patch security vulnerabilities</li>
          <li><strong>Network Monitoring:</strong> Watch for unusual traffic patterns</li>
        </ul>
      </div>
    `
  },

  'Amplification Attacks': {
    title: 'Amplification Attacks',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Using a megaphone to make your voice 100 times louder!</p>
        
        <p>Amplification attacks use public servers to multiply the size of attack traffic, sending massive responses to overwhelm targets.</p>
        
        <h4>📢 Real World Example:</h4>
        <p>Imagine you want to annoy your neighbor:</p>
        <ul>
          <li>You send 100 pizzas to their address (using neighbor's credit card)</li>
          <li>You only made 1 phone call, but 100 delivery trucks show up</li>
          <li>Your small effort created a huge disruption</li>
          <li>The pizza place unknowingly helped your attack</li>
        </ul>
        
        <h4>🌐 How Network Amplification Works:</h4>
        <ol>
          <li><strong>Spoofed Request:</strong> Attacker sends small request with victim's IP as source</li>
          <li><strong>Public Server:</strong> DNS/NTP server receives the request</li>
          <li><strong>Large Response:</strong> Server sends huge response to victim (not attacker)</li>
          <li><strong>Amplification:</strong> 64-byte request becomes 4,000-byte response</li>
          <li><strong>Multiplication:</strong> Repeat with thousands of servers</li>
        </ol>
        
        <h4>📊 Common Amplification Types:</h4>
        <ul>
          <li><strong>DNS Amplification:</strong> Small DNS query → Large DNS response</li>
          <li><strong>NTP Amplification:</strong> Time request → Detailed time info</li>
          <li><strong>SNMP Amplification:</strong> Network query → Full device status</li>
          <li><strong>Memcached:</strong> Small key lookup → Large data dump</li>
        </ul>
        
        <h4>🛡️ Defenses:</h4>
        <ul>
          <li><strong>Rate Limiting:</strong> Limit responses per IP</li>
          <li><strong>Source Verification:</strong> Check if requests are legitimate</li>
          <li><strong>Response Size Limits:</strong> Cap maximum response sizes</li>
          <li><strong>Ingress Filtering:</strong> Block spoofed source addresses</li>
        </ul>
      </div>
    `
  },

  'Network Congestion': {
    title: 'Network Congestion',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> Traffic jams during rush hour!</p>
        
        <p>Network congestion happens when too much data tries to travel through a network connection at the same time, causing slowdowns and delays.</p>
        
        <h4>🚗 Real World Example:</h4>
        <p>Highway during rush hour:</p>
        <ul>
          <li><strong>Normal time:</strong> Cars flow smoothly at highway speed</li>
          <li><strong>Rush hour:</strong> Too many cars, everyone slows down</li>
          <li><strong>Bottleneck:</strong> 4-lane highway becomes 2-lane construction zone</li>
          <li><strong>Result:</strong> Delays, frustration, stop-and-go traffic</li>
        </ul>
        
        <h4>📡 Network Congestion Causes:</h4>
        <ul>
          <li><strong>Too much traffic:</strong> More data than the network can handle</li>
          <li><strong>Bottlenecks:</strong> Slow links in an otherwise fast network</li>
          <li><strong>Equipment limits:</strong> Router or switch running at capacity</li>
          <li><strong>Popular events:</strong> Many people streaming the same video</li>
        </ul>
        
        <h4>📉 Effects You Notice:</h4>
        <ul>
          <li><strong>Slow web browsing:</strong> Pages take forever to load</li>
          <li><strong>Video buffering:</strong> Netflix keeps pausing</li>
          <li><strong>Gaming lag:</strong> High ping times, delayed responses</li>
          <li><strong>File downloads:</strong> Speed drops dramatically</li>
        </ul>
        
        <h4>🛠️ Solutions:</h4>
        <ul>
          <li><strong>Bandwidth upgrades:</strong> Wider "highways" for data</li>
          <li><strong>Traffic shaping:</strong> Prioritize important traffic</li>
          <li><strong>Load balancing:</strong> Spread traffic across multiple paths</li>
          <li><strong>Caching:</strong> Store popular content closer to users</li>
        </ul>
      </div>
    `
  },

  'Quality of Service Degradation': {
    title: 'Quality of Service (QoS) Degradation',
    content: `
      <div class="explanation-content">
        <p><strong>Think of it like:</strong> When a restaurant gets too busy and service quality drops!</p>
        
        <p>QoS degradation happens when network performance drops below acceptable levels, affecting user experience with delays, packet loss, and poor quality.</p>
        
        <h4>🍽️ Real World Example:</h4>
        <p>Restaurant during busy night:</p>
        <ul>
          <li><strong>Normal night:</strong> Fast service, hot food, attentive waiters</li>
          <li><strong>Busy night:</strong> Long waits, cold food, stressed staff</li>
          <li><strong>Quality drops:</strong> Same restaurant, much worse experience</li>
          <li><strong>Customer impact:</strong> Frustration, complaints, poor reviews</li>
        </ul>
        
        <h4>📊 QoS Metrics That Degrade:</h4>
        <ul>
          <li><strong>Latency:</strong> Delays get longer (response time)</li>
          <li><strong>Packet Loss:</strong> Data gets dropped (missing information)</li>
          <li><strong>Jitter:</strong> Inconsistent timing (choppy video calls)</li>
          <li><strong>Throughput:</strong> Bandwidth decreases (slower downloads)</li>
        </ul>
        
        <h4>📱 What You Experience:</h4>
        <ul>
          <li><strong>Video calls:</strong> Pixelated, frozen, audio cuts out</li>
          <li><strong>Streaming:</strong> Constant buffering, low resolution</li>
          <li><strong>Gaming:</strong> Lag, disconnections, poor responsiveness</li>
          <li><strong>Web browsing:</strong> Slow loading, timeouts</li>
        </ul>
        
        <h4>🛠️ QoS Management:</h4>
        <ul>
          <li><strong>Traffic Prioritization:</strong> Important traffic gets priority</li>
          <li><strong>Bandwidth Allocation:</strong> Reserve capacity for critical services</li>
          <li><strong>Queue Management:</strong> Smart handling of network congestion</li>
          <li><strong>Service Level Agreements:</strong> Guaranteed performance standards</li>
        </ul>
      </div>
    `
  }
};

export const getNetworkExplanation = (term: string) => {
  return NETWORK_EXPLANATIONS[term as keyof typeof NETWORK_EXPLANATIONS] || null;
};
