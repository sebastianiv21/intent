Page: Budget Harmony Breakdown

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Budget Harmony | Intentional Spending</title>
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

    ::view-transition-old(main-nav),
    ::view-transition-new(main-nav),
    ::view-transition-old(brand),
    ::view-transition-new(brand),
    ::view-transition-old(fab),
    ::view-transition-new(fab) {
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
      from { opacity: 1; }
      to { opacity: 0; }
    }

    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes soft-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    .float-animation {
      animation: soft-float 4s ease-in-out infinite;
    }
  </style>
</head>
<body>
  <div class="min-h-screen bg-[#16110a] text-[#f5f2ed] flex flex-col md:flex-row">
    
    <!-- Persistent Desktop Sidebar -->
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
        <a href="https://p.superdesign.dev/draft/da688ba6-12f8-45bf-86b9-cb5d459b6680" id="side-nav-transactions" class="flex items-center gap-4 p-4 rounded-2xl text-[#a89580] hover:bg-[#1f1815] hover:text-[#f5f2ed] transition-all duration-300 group">
          <iconify-icon icon="lucide:arrow-up-right" class="text-2xl"></iconify-icon>
          <span class="hidden lg:block font-medium">Transactions</span>
        </a>
        <a href="https://p.superdesign.dev/draft/32b1897b-6466-4005-865d-13c1f8b305f8" id="side-nav-budgets" class="flex items-center gap-4 p-4 rounded-2xl bg-[#1f1815] text-[#c97a5a] group transition-all duration-300">
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
          <p class="text-sm italic text-[#d4a574]">"Awareness is the first step to balance."</p>
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
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div class="flex flex-col">
          <h1 class="text-3xl font-bold text-[#f5f2ed]">Budget Harmony</h1>
          <p class="text-[#a89580] text-sm md:text-base">Tracking your 50/30/20 intentional spending flow.</p>
        </div>
        <div class="flex items-center gap-3 bg-[#1f1815] p-1 rounded-2xl border border-[#2d2420]">
          <button class="px-4 py-2 rounded-xl text-[#a89580] hover:text-[#f5f2ed] hover:bg-[#16110a] transition-all">
            <iconify-icon icon="lucide:chevron-left" class="text-lg"></iconify-icon>
          </button>
          <div class="px-4 py-2 text-sm font-bold">
            March 2024
          </div>
          <button class="px-4 py-2 rounded-xl text-[#a89580] hover:text-[#f5f2ed] hover:bg-[#16110a] transition-all">
            <iconify-icon icon="lucide:chevron-right" class="text-lg"></iconify-icon>
          </button>
        </div>
      </header>

      <!-- Top Overview Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div class="bg-[#1f1815] p-6 rounded-[24px] border border-[#2d2420]">
          <p class="text-[#a89580] text-xs font-bold uppercase tracking-widest mb-1">Total Income</p>
          <p class="text-2xl font-bold">$4,200.00</p>
        </div>
        <div class="bg-[#1f1815] p-6 rounded-[24px] border border-[#2d2420]">
          <p class="text-[#a89580] text-xs font-bold uppercase tracking-widest mb-1">Remaining</p>
          <p class="text-2xl font-bold text-[#9fb89f]">$1,214.50</p>
        </div>
        <div class="bg-[#1f1815] p-6 rounded-[24px] border border-[#2d2420]">
          <p class="text-[#a89580] text-xs font-bold uppercase tracking-widest mb-1">Days Left</p>
          <p class="text-2xl font-bold">12 Days</p>
        </div>
        <div class="bg-[#1f1815] p-6 rounded-[24px] border border-[#2d2420]">
          <p class="text-[#a89580] text-xs font-bold uppercase tracking-widest mb-1">Zen Score</p>
          <div class="flex items-center gap-2">
            <p class="text-2xl font-bold">94</p>
            <iconify-icon icon="lucide:flame" class="text-[#c97a5a]"></iconify-icon>
          </div>
        </div>
      </div>

      <!-- 50/30/20 Detailed Sections -->
      <div class="space-y-8">
        
        <!-- Needs (50%) -->
        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#8b9a7e]/20 flex items-center justify-center text-[#8b9a7e]">
                <iconify-icon icon="lucide:home" class="text-xl"></iconify-icon>
              </div>
              <div>
                <h2 class="text-xl font-bold">Essential Living (Needs)</h2>
                <p class="text-xs text-[#a89580] uppercase tracking-tighter">Allocation: 50% ($2,100)</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold">$1,850.00 <span class="text-xs text-[#a89580] font-normal">/ $2,100</span></p>
              <p class="text-[10px] text-[#9fb89f] font-bold uppercase">$250.00 Left</p>
            </div>
          </div>
          <div class="w-full h-3 bg-[#1f1815] rounded-full overflow-hidden border border-[#2d2420]">
             <div class="h-full bg-[#8b9a7e] rounded-full" style="width: 88%"></div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div class="bg-[#1f1815] p-5 rounded-2xl border border-[#2d2420] flex justify-between items-center">
              <div>
                <p class="text-sm font-semibold">Rent & Mortgage</p>
                <p class="text-xs text-[#a89580]">Monthly Fixed</p>
              </div>
              <p class="font-bold text-[#f5f2ed]">$1,200.00</p>
            </div>
            <div class="bg-[#1f1815] p-5 rounded-2xl border border-[#2d2420] flex justify-between items-center">
              <div>
                <p class="text-sm font-semibold">Utilities & Bills</p>
                <p class="text-xs text-[#a89580]">Electric, Water, Internet</p>
              </div>
              <p class="font-bold text-[#f5f2ed]">$245.00</p>
            </div>
            <div class="bg-[#1f1815] p-5 rounded-2xl border border-[#2d2420] flex justify-between items-center">
              <div>
                <p class="text-sm font-semibold">Groceries</p>
                <p class="text-xs text-[#a89580]">Weekly Essentials</p>
              </div>
              <p class="font-bold text-[#f5f2ed]">$405.00</p>
            </div>
          </div>
        </section>

        <!-- Wants (30%) -->
        <section class="space-y-4 pt-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#c97a5a]/20 flex items-center justify-center text-[#c97a5a]">
                <iconify-icon icon="lucide:coffee" class="text-xl"></iconify-icon>
              </div>
              <div>
                <h2 class="text-xl font-bold">Life's Joy (Wants)</h2>
                <p class="text-xs text-[#a89580] uppercase tracking-tighter">Allocation: 30% ($1,260)</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold">$920.00 <span class="text-xs text-[#a89580] font-normal">/ $1,260</span></p>
              <p class="text-[10px] text-[#9fb89f] font-bold uppercase">$340.00 Left</p>
            </div>
          </div>
          <div class="w-full h-3 bg-[#1f1815] rounded-full overflow-hidden border border-[#2d2420]">
             <div class="h-full bg-[#c97a5a] rounded-full" style="width: 73%"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div class="bg-[#1f1815] p-5 rounded-2xl border border-[#2d2420] flex justify-between items-center">
              <div>
                <p class="text-sm font-semibold">Dining Out</p>
                <p class="text-xs text-[#a89580]">12 visits this month</p>
              </div>
              <p class="font-bold text-[#f5f2ed]">$312.00</p>
            </div>
            <div class="bg-[#1f1815] p-5 rounded-2xl border border-[#2d2420] flex justify-between items-center border-l-4 border-l-[#c97a5a]">
              <div>
                <p class="text-sm font-semibold">Subscriptions</p>
                <p class="text-xs text-[#a89580]">Needs Review (6 Active)</p>
              </div>
              <p class="font-bold text-[#f5f2ed]">$124.00</p>
            </div>
            <div class="bg-[#1f1815] p-5 rounded-2xl border border-[#2d2420] flex justify-between items-center">
              <div>
                <p class="text-sm font-semibold">Leisure & Hobbies</p>
                <p class="text-xs text-[#a89580]">Yoga, Books, Events</p>
              </div>
              <p class="font-bold text-[#f5f2ed]">$484.00</p>
            </div>
          </div>
        </section>

        <!-- Savings (20%) -->
        <section class="space-y-4 pt-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#a89562]/20 flex items-center justify-center text-[#a89562]">
                <iconify-icon icon="lucide:piggy-bank" class="text-xl"></iconify-icon>
              </div>
              <div>
                <h2 class="text-xl font-bold">Future Freedom (Save)</h2>
                <p class="text-xs text-[#a89580] uppercase tracking-tighter">Allocation: 20% ($840)</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold">$840.00 <span class="text-xs text-[#a89580] font-normal">/ $840</span></p>
              <p class="text-[10px] text-[#success] font-bold uppercase">Complete</p>
            </div>
          </div>
          <div class="w-full h-3 bg-[#1f1815] rounded-full overflow-hidden border border-[#2d2420]">
             <div class="h-full bg-[#a89562] rounded-full" style="width: 100%"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div class="bg-[#1f1815] p-5 rounded-2xl border border-[#2d2420] flex justify-between items-center">
              <div>
                <p class="text-sm font-semibold">Emergency Fund</p>
                <p class="text-xs text-[#a89580]">Automated Transfer</p>
              </div>
              <p class="font-bold text-[#f5f2ed]">$400.00</p>
            </div>
            <div class="bg-[#1f1815] p-5 rounded-2xl border border-[#2d2420] flex justify-between items-center">
              <div>
                <p class="text-sm font-semibold">Retirement</p>
                <p class="text-xs text-[#a89580]">401k / Roth IRA</p>
              </div>
              <p class="font-bold text-[#f5f2ed]">$440.00</p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Mobile Bottom Navigation (Persistent) -->
    <nav style="view-transition-name: main-nav" class="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#16110a] border-t border-[#1f1815] flex items-center justify-around px-4 z-50">
      <a href="https://p.superdesign.dev/draft/94f7ec11-dcf8-48b1-afec-3d1d60c6e352" id="mobile-nav-home" class="flex flex-col items-center gap-1 text-[#a89580]">
        <iconify-icon icon="lucide:home" class="text-2xl"></iconify-icon>
        <span class="text-[10px] font-medium uppercase">Home</span>
      </a>
      <a href="https://p.superdesign.dev/draft/da688ba6-12f8-45bf-86b9-cb5d459b6680" id="mobile-nav-history" class="flex flex-col items-center gap-1 text-[#a89580]">
        <iconify-icon icon="lucide:list" class="text-2xl"></iconify-icon>
        <span class="text-[10px] font-medium uppercase">Activity</span>
      </a>
      
      <!-- Floating Action Button (Persistent) -->
      <div style="view-transition-name: fab" class="relative -top-6">
        <button id="fab-add-transaction" class="w-14 h-14 rounded-full warm-gradient shadow-xl shadow-[#c97a5a44] flex items-center justify-center text-white float-animation">
          <iconify-icon icon="lucide:plus" class="text-3xl"></iconify-icon>
        </button>
      </div>

      <a href="https://p.superdesign.dev/draft/32b1897b-6466-4005-865d-13c1f8b305f8" id="mobile-nav-budgets" class="flex flex-col items-center gap-1 text-[#c97a5a]">
        <iconify-icon icon="lucide:pie-chart" class="text-2xl"></iconify-icon>
        <span class="text-[10px] font-medium uppercase">Budgets</span>
      </a>
      <a href="https://p.superdesign.dev/draft/10fb46a0-01e4-403c-9488-08a9c3efc7df" id="mobile-nav-insights" class="flex flex-col items-center gap-1 text-[#a89580]">
        <iconify-icon icon="lucide:sparkles" class="text-2xl"></iconify-icon>
        <span class="text-[10px] font-medium uppercase">Insights</span>
      </a>
    </nav>

    <!-- Modal: Add Transaction Overlay (Hidden by default, copied from source) -->
    <div id="add-modal" class="hidden fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6">
        <div class="absolute inset-0 bg-[#16110a]/80 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-lg bg-[#1f1815] rounded-t-[32px] md:rounded-[32px] border border-[#2d2420] shadow-2xl p-8 transform transition-transform animate-in slide-in-from-bottom duration-300">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl font-bold">New Awareness</h2>
                <button onclick="document.getElementById('add-modal').classList.add('hidden')" class="text-[#a89580]">
                    <iconify-icon icon="lucide:x" class="text-2xl"></iconify-icon>
                </button>
            </div>

            <div class="space-y-6">
                <div>
                    <label class="text-xs font-bold text-[#a89580] uppercase tracking-widest">Amount</label>
                    <input type="text" placeholder="$0.00" class="w-full bg-[#16110a] border border-[#2d2420] rounded-2xl p-4 text-3xl font-bold text-center mt-2 focus:ring-2 focus:ring-[#c97a5a] focus:outline-none placeholder-[#a89580]/30">
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs font-bold text-[#a89580] uppercase tracking-widest">Category</label>
                        <select class="w-full bg-[#16110a] border border-[#2d2420] rounded-2xl p-4 mt-2 focus:ring-2 focus:ring-[#c97a5a] focus:outline-none appearance-none text-[#f5f2ed]">
                            <option>Life's Joy (Wants)</option>
                            <option>Essential (Needs)</option>
                            <option>Future Freedom (Save)</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-bold text-[#a89580] uppercase tracking-widest">Date</label>
                        <div class="relative">
                            <input type="text" value="Today" class="w-full bg-[#16110a] border border-[#2d2420] rounded-2xl p-4 mt-2 focus:ring-2 focus:ring-[#c97a5a] focus:outline-none text-[#f5f2ed]">
                            <iconify-icon icon="lucide:calendar" class="absolute right-4 top-7 text-[#a89580]"></iconify-icon>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="text-xs font-bold text-[#a89580] uppercase tracking-widest">Note (Optional)</label>
                    <textarea placeholder="What was the intention?" class="w-full bg-[#16110a] border border-[#2d2420] rounded-2xl p-4 mt-2 focus:ring-2 focus:ring-[#c97a5a] focus:outline-none h-24 text-[#f5f2ed]"></textarea>
                </div>

                <button class="w-full py-4 rounded-2xl warm-gradient text-white font-bold text-lg shadow-lg hover:opacity-95 active:scale-[0.98] transition-all">
                    Log Intentional Spend
                </button>
            </div>
        </div>
    </div>

  </div>

  <script>
    document.getElementById('fab-add-transaction').addEventListener('click', () => {
        document.getElementById('add-modal').classList.remove('hidden');
    });
  </script>
</body>
</html>
```

Please reference this design and implement it into our codebase; Try to understand the structure, which part of our codebase is relevant and implement
