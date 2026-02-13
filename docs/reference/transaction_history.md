Page: Transaction History

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transaction History | Intentional Spending</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
  <link href="https://api.fontshare.com/v2/css?f[]=plus-jakarta-sans@400,500,600,700,800&display=swap" rel="stylesheet">
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

    body {
      margin: 0;
      padding: 0;
      background-color: var(--background);
    }

    .warm-gradient {
      background: linear-gradient(135deg, var(--primary), #a36248);
    }

    @view-transition {
      navigation: auto;
    }

    ::view-transition-old(main-nav), ::view-transition-new(main-nav),
    ::view-transition-old(mobile-nav), ::view-transition-new(mobile-nav),
    ::view-transition-old(fab), ::view-transition-new(fab),
    ::view-transition-old(brand), ::view-transition-new(brand) {
      animation: none;
      mix-blend-mode: normal;
    }

    ::view-transition-old(main-content) {
      animation: 0.25s ease-out both fade-out;
    }
    ::view-transition-new(main-content) {
      animation: 0.25s ease-in 0.1s both fade-in;
    }

    @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
  </style>
</head>
<body>
  <div class="min-h-screen bg-[#16110a] text-[#f5f2ed] flex flex-col md:flex-row">
    
    <!-- Desktop Sidebar (Persistent) -->
    <aside style="view-transition-name: main-nav" class="hidden md:flex w-24 lg:w-64 border-r border-[#1f1815] bg-[#16110a] sticky top-0 h-screen flex-col items-center lg:items-start py-8 px-4 gap-12 z-50">
      <div style="view-transition-name: brand" class="flex items-center gap-3 px-2">
        <div class="w-10 h-10 rounded-xl warm-gradient flex items-center justify-center text-white shadow-lg shadow-[#c97a5a33]">
          <iconify-icon icon="lucide:leaf" class="text-2xl"></iconify-icon>
        </div>
        <span class="hidden lg:block font-bold text-xl tracking-tight text-[#f5f2ed]">Intent</span>
      </div>

      <nav class="flex flex-col gap-4 w-full">
        <a href="https://p.superdesign.dev/draft/94f7ec11-dcf8-48b1-afec-3d1d60c6e352" id="side-nav-home" class="flex items-center gap-4 p-4 rounded-2xl text-[#a89580] hover:bg-[#1f1815] hover:text-[#f5f2ed] transition-all duration-300 group">
          <iconify-icon icon="lucide:layout-grid" class="text-2xl"></iconify-icon>
          <span class="hidden lg:block font-medium">Dashboard</span>
        </a>
        <a href="https://p.superdesign.dev/draft/da688ba6-12f8-45bf-86b9-cb5d459b6680" id="side-nav-transactions" class="flex items-center gap-4 p-4 rounded-2xl bg-[#1f1815] text-[#c97a5a] group transition-all duration-300">
          <iconify-icon icon="lucide:arrow-up-right" class="text-2xl"></iconify-icon>
          <span class="hidden lg:block font-medium">Transactions</span>
        </a>
        <a href="https://p.superdesign.dev/draft/32b1897b-6466-4005-865d-13c1f8b305f8" id="side-nav-budgets" class="flex items-center gap-4 p-4 rounded-2xl text-[#a89580] hover:bg-[#1f1815] hover:text-[#f5f2ed] transition-all duration-300 group">
          <iconify-icon icon="lucide:pie-chart" class="text-2xl"></iconify-icon>
          <span class="hidden lg:block font-medium">Budgets</span>
        </a>
        <a href="https://p.superdesign.dev/draft/10fb46a0-01e4-403c-9488-08a9c3efc7df" id="side-nav-insights" class="flex items-center gap-4 p-4 rounded-2xl text-[#a89580] hover:bg-[#1f1815] hover:text-[#f5f2ed] transition-all duration-300 group">
          <iconify-icon icon="lucide:sparkles" class="text-2xl"></iconify-icon>
          <span class="hidden lg:block font-medium">Insights</span>
        </a>
      </nav>

      <div class="mt-auto w-full px-2">
        <div class="p-4 rounded-2xl bg-[#1f1815] border border-[#2d2420] text-center hidden lg:block">
          <p class="text-xs text-[#a89580] mb-2">Mindful Tip</p>
          <p class="text-sm italic text-[#d4a574]">"Small shifts lead to big transformations."</p>
        </div>
        <div class="flex items-center gap-3 mt-8">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c97a5a" class="w-10 h-10 rounded-full border-2 border-[#1f1815]" alt="Profile">
          <div class="hidden lg:block">
            <p class="text-sm font-semibold text-[#f5f2ed]">Felix Arvid</p>
            <p class="text-xs text-[#a89580]">Zen Level 12</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main style="view-transition-name: main-content" class="flex-1 w-full max-w-7xl mx-auto px-6 pt-8 pb-32 md:pb-12">
      
      <!-- Header -->
      <header class="flex justify-between items-center mb-8">
        <div class="flex flex-col">
          <h1 class="text-2xl md:text-3xl font-bold text-[#f5f2ed]">Transaction History</h1>
          <p class="text-[#a89580] text-sm md:text-base">Review your path to financial mindfulness.</p>
        </div>
        <div class="flex gap-3">
           <button id="filter-toggle" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#1f1815] border border-[#2d2420] hover:bg-[#2d2420] transition-colors">
             <iconify-icon icon="lucide:sliders-horizontal" class="text-xl text-[#a89580]"></iconify-icon>
           </button>
           <button id="settings-btn" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#1f1815] border border-[#2d2420] hover:bg-[#2d2420] transition-colors">
             <iconify-icon icon="lucide:settings-2" class="text-xl text-[#a89580]"></iconify-icon>
           </button>
        </div>
      </header>

      <!-- Search & Quick Filters -->
      <div class="space-y-6 mb-8">
        <div class="relative">
          <iconify-icon icon="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 text-[#a89580] text-xl"></iconify-icon>
          <input type="text" placeholder="Search merchants, notes, or amounts..." 
            class="w-full bg-[#1f1815] border border-[#2d2420] rounded-[20px] py-4 pl-12 pr-6 text-[#f5f2ed] placeholder-[#a89580]/50 focus:outline-none focus:ring-2 focus:ring-[#c97a5a] transition-all">
        </div>

        <div class="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
          <button class="px-6 py-2.5 rounded-full bg-[#c97a5a] text-white text-sm font-semibold whitespace-nowrap">All Activity</button>
          <button class="px-6 py-2.5 rounded-full bg-[#1f1815] border border-[#2d2420] text-[#a89580] text-sm font-semibold whitespace-nowrap hover:text-[#f5f2ed] transition-colors">Needs</button>
          <button class="px-6 py-2.5 rounded-full bg-[#1f1815] border border-[#2d2420] text-[#a89580] text-sm font-semibold whitespace-nowrap hover:text-[#f5f2ed] transition-colors">Wants</button>
          <button class="px-6 py-2.5 rounded-full bg-[#1f1815] border border-[#2d2420] text-[#a89580] text-sm font-semibold whitespace-nowrap hover:text-[#f5f2ed] transition-colors">Savings</button>
          <button class="px-6 py-2.5 rounded-full bg-[#1f1815] border border-[#2d2420] text-[#a89580] text-sm font-semibold whitespace-nowrap hover:text-[#f5f2ed] transition-colors">Income</button>
        </div>
      </div>

      <!-- Grouped Transaction List -->
      <div class="space-y-10">
        
        <!-- Day Group -->
        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold text-[#a89580] uppercase tracking-[0.2em]">Today, March 14</h2>
            <span class="text-xs text-[#a89580]">Total: -$124.50</span>
          </div>
          <div class="space-y-3">
            <!-- Item -->
            <div class="flex items-center justify-between p-5 rounded-3xl bg-[#1f1815] border border-[#2d2420] hover:border-[#c97a5a33] transition-all cursor-pointer group">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-[#c97a5a]/10 flex items-center justify-center text-[#c97a5a] group-hover:scale-105 transition-transform">
                  <iconify-icon icon="lucide:coffee" class="text-2xl"></iconify-icon>
                </div>
                <div>
                  <p class="font-semibold text-[#f5f2ed] text-lg">Zen Roast Coffee</p>
                  <p class="text-sm text-[#a89580]">08:42 AM • <span class="text-[#c97a5a]">Wants</span></p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-xl text-[#f5f2ed]">-$8.50</p>
                <iconify-icon icon="lucide:check-circle-2" class="text-[#9fb89f] text-sm"></iconify-icon>
              </div>
            </div>
            <!-- Item -->
            <div class="flex items-center justify-between p-5 rounded-3xl bg-[#1f1815] border border-[#2d2420] hover:border-[#8b9a7e33] transition-all cursor-pointer group">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-[#8b9a7e]/10 flex items-center justify-center text-[#8b9a7e] group-hover:scale-105 transition-transform">
                  <iconify-icon icon="lucide:shopping-cart" class="text-2xl"></iconify-icon>
                </div>
                <div>
                  <p class="font-semibold text-[#f5f2ed] text-lg">Local Grocery Market</p>
                  <p class="text-sm text-[#a89580]">04:15 PM • <span class="text-[#8b9a7e]">Needs</span></p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-xl text-[#f5f2ed]">-$116.00</p>
                <span class="text-[10px] text-[#a89580] uppercase tracking-tighter">Verified</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Day Group -->
        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold text-[#a89580] uppercase tracking-[0.2em]">Yesterday, March 13</h2>
            <span class="text-xs text-[#a89580]">Total: -$42.20</span>
          </div>
          <div class="space-y-3">
            <!-- Item -->
            <div class="flex items-center justify-between p-5 rounded-3xl bg-[#1f1815] border border-[#2d2420] hover:border-[#c97a5a33] transition-all cursor-pointer group">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-[#c97a5a]/10 flex items-center justify-center text-[#c97a5a] group-hover:scale-105 transition-transform">
                  <iconify-icon icon="lucide:film" class="text-2xl"></iconify-icon>
                </div>
                <div>
                  <p class="font-semibold text-[#f5f2ed] text-lg">Cinema Tickets</p>
                  <p class="text-sm text-[#a89580]">07:30 PM • <span class="text-[#c97a5a]">Wants</span></p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-xl text-[#f5f2ed]">-$42.20</p>
                <iconify-icon icon="lucide:sparkles" class="text-[#a89562] text-sm"></iconify-icon>
              </div>
            </div>
          </div>
        </section>

        <!-- Day Group -->
        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-bold text-[#a89580] uppercase tracking-[0.2em]">March 12</h2>
            <span class="text-xs text-[#a89580]">Total: +$1,400.00</span>
          </div>
          <div class="space-y-3">
             <!-- Item -->
             <div class="flex items-center justify-between p-5 rounded-3xl bg-[#1f1815] border border-[#2d2420] hover:border-[#9fb89f33] transition-all cursor-pointer group">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-[#9fb89f]/10 flex items-center justify-center text-[#9fb89f] group-hover:scale-105 transition-transform">
                  <iconify-icon icon="lucide:briefcase" class="text-2xl"></iconify-icon>
                </div>
                <div>
                  <p class="font-semibold text-[#f5f2ed] text-lg">Client Project Payout</p>
                  <p class="text-sm text-[#a89580]">11:00 AM • <span class="text-[#9fb89f]">Income</span></p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-xl text-[#9fb89f]">+$1,400.00</p>
                <span class="text-[10px] text-[#9fb89f] uppercase tracking-tighter">Settled</span>
              </div>
            </div>
            <!-- Item -->
            <div class="flex items-center justify-between p-5 rounded-3xl bg-[#1f1815] border border-[#2d2420] hover:border-[#a8956233] transition-all cursor-pointer group">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-[#a89562]/10 flex items-center justify-center text-[#a89562] group-hover:scale-105 transition-transform">
                  <iconify-icon icon="lucide:piggy-bank" class="text-2xl"></iconify-icon>
                </div>
                <div>
                  <p class="font-semibold text-[#f5f2ed] text-lg">Auto-Save Transfer</p>
                  <p class="text-sm text-[#a89580]">09:00 AM • <span class="text-[#a89562]">Savings</span></p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-xl text-[#f5f2ed]">-$250.00</p>
                <span class="text-[10px] text-[#a89580] uppercase tracking-tighter">Automated</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Empty State / Loading Indicator (Simulation) -->
      <div class="mt-12 text-center">
         <p class="text-[#a89580] text-sm">Showing 48 transactions from the last 30 days.</p>
         <button class="mt-4 text-[#c97a5a] font-semibold hover:underline">Load Older Awareness</button>
      </div>

    </main>

    <!-- Mobile Bottom Navigation (Persistent) -->
    <nav style="view-transition-name: mobile-nav" class="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#16110a] border-t border-[#1f1815] flex items-center justify-around px-4 z-50">
      <a href="https://p.superdesign.dev/draft/94f7ec11-dcf8-48b1-afec-3d1d60c6e352" id="mobile-nav-home" class="flex flex-col items-center gap-1 text-[#a89580]">
        <iconify-icon icon="lucide:home" class="text-2xl"></iconify-icon>
        <span class="text-[10px] font-medium uppercase">Home</span>
      </a>
      <a href="https://p.superdesign.dev/draft/da688ba6-12f8-45bf-86b9-cb5d459b6680" id="mobile-nav-history" class="flex flex-col items-center gap-1 text-[#c97a5a]">
        <iconify-icon icon="lucide:list" class="text-2xl"></iconify-icon>
        <span class="text-[10px] font-medium uppercase">Activity</span>
      </a>
      
      <!-- Floating Action Button -->
      <div style="view-transition-name: fab" class="relative -top-6">
        <a href="https://p.superdesign.dev/draft/7991b0a8-68e4-484c-857b-94a5000d1420" id="fab-add-transaction" class="w-14 h-14 rounded-full warm-gradient shadow-xl shadow-[#c97a5a44] flex items-center justify-center text-white">
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
