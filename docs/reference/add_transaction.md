Page: New Awareness | Add Transaction

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Awareness | Mindful Expense Tracker</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
  <link href="https://api.fontshare.com/v2/css?f[]=plus-jakarta-sans@400,500,600,700,800&f[]=jet-brains-mono@500,700&display=swap" rel="stylesheet">
  <meta name="view-transition" content="same-origin">
  <link rel="prefetch" href="https://p.superdesign.dev/draft/07296efa-dbb6-40e4-96aa-8a8a81589abb" as="document">
  <link rel="prefetch" href="https://p.superdesign.dev/draft/94f7ec11-dcf8-48b1-afec-3d1d60c6e352" as="document">
  <link rel="prefetch" href="https://p.superdesign.dev/draft/da688ba6-12f8-45bf-86b9-cb5d459b6680" as="document">
  <link rel="prefetch" href="https://p.superdesign.dev/draft/7991b0a8-68e4-484c-857b-94a5000d1420" as="document">
  <link rel="prefetch" href="https://p.superdesign.dev/draft/32b1897b-6466-4005-865d-13c1f8b305f8" as="document">
  <link rel="prefetch" href="https://p.superdesign.dev/draft/10fb46a0-01e4-403c-9488-08a9c3efc7df" as="document">
  <style>
    :root {
      --background: #16110a;
      --surface: #1f1815;
      --primary: #c97a5a;
      --secondary: #8b9a7e;
      --tertiary: #a89562;
      --muted: #a89580;
      --success: #9fb89f;
      --warning: #d4a574;
      --radius-xl: 24px;
      --radius-lg: 16px;
      --radius-md: 12px;
    }

    * {
      font-family: 'Plus Jakarta Sans', sans-serif;
      scrollbar-width: thin;
      scrollbar-color: var(--surface) var(--background);
    }

    .mono-font {
      font-family: 'JetBrains Mono', monospace;
    }

    .warm-gradient {
      background: linear-gradient(135deg, var(--primary), #a36248);
    }

    @view-transition {
      navigation: auto;
    }

    html {
      background-color: var(--background);
    }

    ::view-transition-old(main-nav),
    ::view-transition-new(main-nav),
    ::view-transition-old(side-sidebar),
    ::view-transition-new(side-sidebar),
    ::view-transition-old(fab-button),
    ::view-transition-new(fab-button) {
      animation: none;
      mix-blend-mode: normal;
    }

    ::view-transition-old(main-content) {
      animation: 0.25s ease-out both fade-out;
    }
    ::view-transition-new(main-content) {
      animation: 0.25s ease-in 0.1s both fade-in;
    }

    @keyframes fade-out {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(10px); }
    }
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .custom-shadow {
      box-shadow: 0 20px 50px -12px rgba(20, 15, 10, 0.7);
    }

    .input-glow:focus-within {
      box-shadow: 0 0 0 2px var(--primary), 0 0 20px rgba(201, 122, 90, 0.2);
    }

    @keyframes soft-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    .float-animation { animation: soft-float 4s ease-in-out infinite; }
  </style>
</head>
<body>
  <div class="min-h-screen bg-[#16110a] text-[#f5f2ed] flex flex-col md:flex-row">
    
    <!-- Persistent Desktop Sidebar -->
    <aside style="view-transition-name: side-sidebar;" class="hidden md:flex w-24 lg:w-64 border-r border-[#1f1815] bg-[#16110a] sticky top-0 h-screen flex-col items-center lg:items-start py-8 px-4 gap-12 z-50">
      <div class="flex items-center gap-3 px-2">
        <div class="w-10 h-10 rounded-xl warm-gradient flex items-center justify-center text-white shadow-lg">
          <iconify-icon icon="lucide:leaf" class="text-2xl"></iconify-icon>
        </div>
        <span class="hidden lg:block font-bold text-xl tracking-tight text-[#f5f2ed]">Intent</span>
      </div>

      <nav class="flex flex-col gap-4 w-full">
        <a href="https://p.superdesign.dev/draft/94f7ec11-dcf8-48b1-afec-3d1d60c6e352" id="side-nav-home" class="flex items-center gap-4 p-4 rounded-2xl text-[#a89580] hover:bg-[#1f1815] transition-all duration-300">
          <iconify-icon icon="lucide:layout-grid" class="text-2xl"></iconify-icon>
          <span class="hidden lg:block font-medium">Dashboard</span>
        </a>
        <a href="https://p.superdesign.dev/draft/da688ba6-12f8-45bf-86b9-cb5d459b6680" id="side-nav-transactions" class="flex items-center gap-4 p-4 rounded-2xl text-[#a89580] hover:bg-[#1f1815] transition-all duration-300">
          <iconify-icon icon="lucide:arrow-up-right" class="text-2xl"></iconify-icon>
          <span class="hidden lg:block font-medium">Transactions</span>
        </a>
        <a href="https://p.superdesign.dev/draft/32b1897b-6466-4005-865d-13c1f8b305f8" id="side-nav-budgets" class="flex items-center gap-4 p-4 rounded-2xl text-[#a89580] hover:bg-[#1f1815] transition-all duration-300">
          <iconify-icon icon="lucide:pie-chart" class="text-2xl"></iconify-icon>
          <span class="hidden lg:block font-medium">Budgets</span>
        </a>
        <a href="https://p.superdesign.dev/draft/10fb46a0-01e4-403c-9488-08a9c3efc7df" id="side-nav-insights" class="flex items-center gap-4 p-4 rounded-2xl text-[#a89580] hover:bg-[#1f1815] transition-all duration-300">
          <iconify-icon icon="lucide:sparkles" class="text-2xl"></iconify-icon>
          <span class="hidden lg:block font-medium">Insights</span>
        </a>
      </nav>

      <div class="mt-auto w-full px-2">
        <div class="flex items-center gap-3 mt-8">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c97a5a" class="w-10 h-10 rounded-full border-2 border-[#1f1815]" alt="Profile">
          <div class="hidden lg:block">
            <p class="text-sm font-semibold">Felix Arvid</p>
            <p class="text-xs text-[#a89580]">Zen Level 12</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main style="view-transition-name: main-content;" class="flex-1 w-full max-w-7xl mx-auto px-6 py-8 pb-32 md:pb-12 flex flex-col">
      
      <!-- Focused Header -->
      <header class="flex justify-between items-center mb-8">
        <a href="https://p.superdesign.dev/draft/94f7ec11-dcf8-48b1-afec-3d1d60c6e352" class="flex items-center gap-2 text-[#a89580] hover:text-[#f5f2ed] transition-colors">
          <iconify-icon icon="lucide:chevron-left" class="text-2xl"></iconify-icon>
          <span class="font-medium">Cancel</span>
        </a>
        <h1 class="text-xl font-bold">New Awareness</h1>
        <div class="w-10"></div>
      </header>

      <!-- Add Transaction Form Container -->
      <div class="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        <div class="w-full bg-[#1f1815] border border-[#2d2420] rounded-[40px] p-8 custom-shadow flex flex-col gap-8">
          
          <!-- Amount Input -->
          <div class="space-y-2 text-center">
            <label class="text-xs font-bold text-[#a89580] uppercase tracking-widest">Spending Amount</label>
            <div class="relative flex items-center justify-center group">
              <span class="text-4xl md:text-5xl font-extrabold text-[#c97a5a] mr-2 mono-font">$</span>
              <input type="text" placeholder="0.00" class="bg-transparent border-none text-center text-5xl md:text-6xl font-extrabold mono-font focus:outline-none w-full placeholder-[#a89580]/20 text-[#f5f2ed] selection:bg-[#c97a5a]/30" autofocus>
            </div>
          </div>

          <!-- Category Pills -->
          <div class="space-y-4">
            <label class="text-xs font-bold text-[#a89580] uppercase tracking-widest">Category Choice</label>
            <div class="grid grid-cols-3 gap-3">
              <button class="flex flex-col items-center gap-3 p-4 rounded-3xl bg-[#16110a] border-2 border-[#8b9a7e] text-[#8b9a7e] transition-all hover:scale-[1.02]">
                <iconify-icon icon="lucide:home" class="text-2xl"></iconify-icon>
                <span class="text-[10px] font-bold uppercase tracking-tighter">Needs</span>
              </button>
              <button class="flex flex-col items-center gap-3 p-4 rounded-3xl bg-[#16110a] border-2 border-transparent text-[#a89580] hover:border-[#c97a5a]/30 transition-all hover:scale-[1.02]">
                <iconify-icon icon="lucide:coffee" class="text-2xl"></iconify-icon>
                <span class="text-[10px] font-bold uppercase tracking-tighter">Wants</span>
              </button>
              <button class="flex flex-col items-center gap-3 p-4 rounded-3xl bg-[#16110a] border-2 border-transparent text-[#a89580] hover:border-[#a89562]/30 transition-all hover:scale-[1.02]">
                <iconify-icon icon="lucide:piggy-bank" class="text-2xl"></iconify-icon>
                <span class="text-[10px] font-bold uppercase tracking-tighter">Save</span>
              </button>
            </div>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-xs font-bold text-[#a89580] uppercase tracking-widest">Merchant / Name</label>
              <div class="relative">
                <input type="text" placeholder="Where was this?" class="w-full bg-[#16110a] border border-[#2d2420] rounded-2xl p-4 text-sm focus:ring-1 focus:ring-[#c97a5a] focus:outline-none">
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold text-[#a89580] uppercase tracking-widest">Spending Date</label>
              <div class="relative">
                <input type="text" value="Today, March 12" class="w-full bg-[#16110a] border border-[#2d2420] rounded-2xl p-4 text-sm focus:ring-1 focus:ring-[#c97a5a] focus:outline-none">
                <iconify-icon icon="lucide:calendar" class="absolute right-4 top-1/2 -translate-y-1/2 text-[#a89580]"></iconify-icon>
              </div>
            </div>
          </div>

          <!-- Mindful Note -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-[#a89580] uppercase tracking-widest">The Intention (Notes)</label>
            <textarea placeholder="What was the mindful reason for this spend?" class="w-full bg-[#16110a] border border-[#2d2420] rounded-2xl p-4 text-sm focus:ring-1 focus:ring-[#c97a5a] focus:outline-none h-24 resize-none"></textarea>
          </div>

          <!-- Submit Button -->
          <button class="w-full py-5 rounded-[24px] warm-gradient text-white font-bold text-lg shadow-xl shadow-[#c97a5a44] flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all">
            <span>Log Intentional Spending</span>
            <iconify-icon icon="lucide:check-circle"></iconify-icon>
          </button>
        </div>
        
        <p class="mt-8 text-center text-sm text-[#a89580] max-w-xs leading-relaxed">
          "Every purchase is a vote for the world you want to live in."
        </p>
      </div>
    </main>

    <!-- Persistent Mobile Bottom Navigation -->
    <nav style="view-transition-name: main-nav;" class="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#16110a] border-t border-[#1f1815] flex items-center justify-around px-4 z-50">
      <a href="https://p.superdesign.dev/draft/94f7ec11-dcf8-48b1-afec-3d1d60c6e352" id="mobile-nav-home" class="flex flex-col items-center gap-1 text-[#a89580]">
        <iconify-icon icon="lucide:home" class="text-2xl"></iconify-icon>
        <span class="text-[10px] font-medium uppercase">Home</span>
      </a>
      <a href="https://p.superdesign.dev/draft/da688ba6-12f8-45bf-86b9-cb5d459b6680" id="mobile-nav-history" class="flex flex-col items-center gap-1 text-[#a89580]">
        <iconify-icon icon="lucide:list" class="text-2xl"></iconify-icon>
        <span class="text-[10px] font-medium uppercase">Activity</span>
      </a>
      
      <!-- Persistent Floating Action Button -->
      <div class="relative -top-6">
        <a href="https://p.superdesign.dev/draft/7991b0a8-68e4-484c-857b-94a5000d1420" id="mobile-nav-add" style="view-transition-name: fab-button;" class="w-14 h-14 rounded-full warm-gradient shadow-xl shadow-[#c97a5a44] flex items-center justify-center text-white float-animation active:scale-90 transition-transform">
          <iconify-icon icon="lucide:plus" class="text-3xl"></iconify-icon>
        </a>
      </div>

      <a href="https://p.superdesign.dev/draft/10fb46a0-01e4-403c-9488-08a9c3efc7df" id="mobile-nav-stats" class="flex flex-col items-center gap-1 text-[#a89580]">
        <iconify-icon icon="lucide:bar-chart-3" class="text-2xl"></iconify-icon>
        <span class="text-[10px] font-medium uppercase">Stats</span>
      </a>
      <a href="#profile" id="mobile-nav-profile" class="flex flex-col items-center gap-1 text-[#a89580]">
        <iconify-icon icon="lucide:user" class="text-2xl"></iconify-icon>
        <span class="text-[10px] font-medium uppercase">Profile</span>
      </a>
    </nav>

  </div>
</body>
</html>
```

Please reference this design and implement it into our codebase; Try to understand the structure, which part of our codebase is relevant and implement
