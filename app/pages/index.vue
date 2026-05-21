<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 font-sans">
    <header class="bg-slate-800 text-white p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <div>
          <h1 class="text-xl font-bold tracking-wider">建設リソース配置管理システム</h1>
          <p class="text-xs text-slate-400 mt-0.5">対象期間: {{ startDate }} 〜 {{ endDate }}</p>
        </div>
        <div class="bg-blue-600 px-3 py-1 rounded text-sm font-semibold animate-pulse">
          無料開放版（試験運用中）
        </div>
      </div>
    </header>

    <main class="container mx-auto p-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
        <div class="overflow-x-auto">
          <table class="w-full table-layout-fixed border-collapse">
            
            <thead>
              <tr class="bg-slate-100">
                <th class="w-48 p-3 border-b border-r border-gray-300 text-left font-semibold text-slate-700 bg-slate-200 sticky left-0 z-10">
                  リソース名 / 日付
                </th>
                <th 
                  v-for="date in dateRange" 
                  :key="date.raw" 
                  :class="[
                    'p-2 border-b border-r border-gray-300 text-center text-xs min-w-[100px]',
                    date.isToday ? 'bg-amber-100 font-bold text-amber-800' : 'text-slate-600'
                  ]"
                >
                  <div>{{ date.displayMonthDay }}</div>
                  <div class="text-[10px] opacity-75">({{ date.dayOfWeek }})</div>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr class="bg-slate-50">
                <td :colspan="dateRange.length + 1" class="p-2 border-b border-gray-300 font-bold text-sm text-blue-800 bg-blue-50/50 sticky left-0">
                  👤 人員（Staff）セクション
                </td>
              </tr>
              <tr v-for="s in staffList" :key="'staff-' + s.id" class="hover:bg-gray-50">
                <td class="p-3 border-b border-r border-gray-200 font-medium text-sm bg-white sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                  {{ s.name }} <span class="text-xs text-gray-400 block font-normal">{{ s.role }}</span>
                </td>
                <td 
                  v-for="date in dateRange" 
                  :key="'staff-date-' + date.raw"
                  :class="['p-1 border-b border-r border-gray-200 text-center h-14 relative', date.isToday ? 'bg-amber-50/30' : '']"
                >
                  <div 
                    v-if="getScheduleForResource('staff', s.id, date.raw)"
                    :style="{ backgroundColor: getScheduleForResource('staff', s.id, date.raw).projects.color_code }"
                    class="text-white text-xs p-1 rounded shadow-sm text-left truncate h-full flex flex-col justify-between"
                  >
                    <span class="font-bold block truncate">{{ getScheduleForResource('staff', s.id, date.raw).projects.name }}</span>
                    <span class="text-[10px] opacity-90 truncate" v-if="getScheduleForResource('staff', s.id, date.raw).note">
                      📝{{ getScheduleForResource('staff', s.id, date.raw).note }}
                    </span>
                  </div>
                </td>
              </tr>

              <tr class="bg-slate-50">
                <td :colspan="dateRange.length + 1" class="p-2 border-b border-gray-300 font-bold text-sm text-emerald-800 bg-emerald-50/50 sticky left-0">
                  🚚 車両・重機（Vehicles）セクション
                </td>
              </tr>
              <tr v-for="v in vehicleList" :key="'vehicle-' + v.id" class="hover:bg-gray-50">
                <td class="p-3 border-b border-r border-gray-200 font-medium text-sm bg-white sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                  {{ v.name }} <span class="text-xs text-gray-400 block font-normal">{{ v.type }}</span>
                </td>
                <td 
                  v-for="date in dateRange" 
                  :key="'vehicle-date-' + date.raw"
                  :class="['p-1 border-b border-r border-gray-200 text-center h-14 relative', date.isToday ? 'bg-amber-50/30' : '']"
                >
                  <div 
                    v-if="getScheduleForResource('vehicle', v.id, date.raw)"
                    :style="{ backgroundColor: getScheduleForResource('vehicle', v.id, date.raw).projects.color_code }"
                    class="text-white text-xs p-1 rounded shadow-sm text-left truncate h-full flex flex-col justify-between"
                  >
                    <span class="font-bold block truncate">{{ getScheduleForResource('vehicle', v.id, date.raw).projects.name }}</span>
                    <span class="text-[10px] opacity-90 truncate" v-if="getScheduleForResource('vehicle', v.id, date.raw).note">
                      📝{{ getScheduleForResource('vehicle', v.id, date.raw).note }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 1. 定数・期間定義 (2026-05-11 〜 2026-05-24 の14日間)
const startDate = '2026-05-11'
const endDate = '2026-05-24'
const todayStr = '2026-05-21' // 本日日付

// 2. 状態管理（リアクティブデータ）
const supabase = useSupabaseClient()
const dateRange = ref([])
const staffList = ref([])
const vehicleList = ref([])
const schedules = ref([])

// 3. 2週間分の日付配列を100%安全に生成するロジック
const generateDateRange = () => {
  const dates = []
  const start = new Date(startDate)
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土']
  
  for (let i = 0; i < 14; i++) {
    const current = new Date(start)
    current.setDate(start.getDate() + i)
    
    // YYYY-MM-DD 形式の文字列を作成（タイムゾーンのズレを完全に防止）
    const yyyy = current.getFullYear()
    const mm = String(current.getMonth() + 1).padStart(2, '0')
    const dd = String(current.getDate()).padStart(2, '0')
    const rawStr = `${yyyy}-${mm}-${dd}`

    dates.push({
      raw: rawStr,
      displayMonthDay: `${parseInt(mm)}/${parseInt(dd)}`,
      dayOfWeek: daysOfWeek[current.getDay()],
      isToday: rawStr === todayStr
    })
  }
  dateRange.value = dates
}

// 4. Supabaseからデータをまとめて取得するロジック
const fetchData = async () => {
  try {
    // マスターデータの取得
    const { data: staffData } = await supabase.from('staff').select('*').eq('is_active', true).order('id')
    const { data: vehicleData } = await supabase.from('vehicles').select('*').eq('is_active', true).order('id')
    
    // スケジュールと現場（projects）を結合して取得
    const { data: scheduleData } = await supabase
      .from('schedules')
      .select(`
        id,
        work_date,
        staff_id,
        vehicle_id,
        note,
        projects ( name, color_code )
      `)
      .gte('work_date', startDate)
      .lte('work_date', endDate)

    staffList.value = staffData || []
    vehicleList.value = vehicleData || []
    schedules.value = scheduleData || []
  } catch (error) {
    console.error('データ取得エラー:', error)
  }
}

// 5. 特定のセル（リソース × 日付）に合致する配置予定を探すヘルパー関数
const getScheduleForResource = (type, id, dateRaw) => {
  return schedules.value.find(item => {
    const matchDate = item.work_date === dateRaw
    if (!matchDate) return false
    return type === 'staff' ? item.staff_id === id : item.vehicle_id === id
  })
}

// 6. 初期化
onMounted(() => {
  generateDateRange()
  fetchData()
})
</script>