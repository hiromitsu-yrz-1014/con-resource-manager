import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { u as useNuxtApp } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@supabase/ssr';

const useSupabaseClient = () => {
  return useNuxtApp().$supabase.client;
};
const startDate = "2026-05-11";
const endDate = "2026-05-24";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    const dateRange = ref([]);
    const staffList = ref([]);
    const vehicleList = ref([]);
    const schedules = ref([]);
    const getScheduleForResource = (type, id, dateRaw) => {
      return schedules.value.find((item) => {
        const matchDate = item.work_date === dateRaw;
        if (!matchDate) return false;
        return type === "staff" ? item.staff_id === id : item.vehicle_id === id;
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 text-gray-800 font-sans" }, _attrs))}><header class="bg-slate-800 text-white p-4 shadow-md"><div class="container mx-auto flex justify-between items-center"><div><h1 class="text-xl font-bold tracking-wider">建設リソース配置管理システム</h1><p class="text-xs text-slate-400 mt-0.5">対象期間: ${ssrInterpolate(startDate)} 〜 ${ssrInterpolate(endDate)}</p></div><div class="bg-blue-600 px-3 py-1 rounded text-sm font-semibold animate-pulse"> 無料開放版（試験運用中） </div></div></header><main class="container mx-auto p-6"><div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"><div class="overflow-x-auto"><table class="w-full table-layout-fixed border-collapse"><thead><tr class="bg-slate-100"><th class="w-48 p-3 border-b border-r border-gray-300 text-left font-semibold text-slate-700 bg-slate-200 sticky left-0 z-10"> リソース名 / 日付 </th><!--[-->`);
      ssrRenderList(dateRange.value, (date) => {
        _push(`<th class="${ssrRenderClass([
          "p-2 border-b border-r border-gray-300 text-center text-xs min-w-[100px]",
          date.isToday ? "bg-amber-100 font-bold text-amber-800" : "text-slate-600"
        ])}"><div>${ssrInterpolate(date.displayMonthDay)}</div><div class="text-[10px] opacity-75">(${ssrInterpolate(date.dayOfWeek)})</div></th>`);
      });
      _push(`<!--]--></tr></thead><tbody><tr class="bg-slate-50"><td${ssrRenderAttr("colspan", dateRange.value.length + 1)} class="p-2 border-b border-gray-300 font-bold text-sm text-blue-800 bg-blue-50/50 sticky left-0"> 👤 人員（Staff）セクション </td></tr><!--[-->`);
      ssrRenderList(staffList.value, (s) => {
        _push(`<tr class="hover:bg-gray-50"><td class="p-3 border-b border-r border-gray-200 font-medium text-sm bg-white sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">${ssrInterpolate(s.name)} <span class="text-xs text-gray-400 block font-normal">${ssrInterpolate(s.role)}</span></td><!--[-->`);
        ssrRenderList(dateRange.value, (date) => {
          _push(`<td class="${ssrRenderClass(["p-1 border-b border-r border-gray-200 text-center h-14 relative", date.isToday ? "bg-amber-50/30" : ""])}">`);
          if (getScheduleForResource("staff", s.id, date.raw)) {
            _push(`<div style="${ssrRenderStyle({ backgroundColor: getScheduleForResource("staff", s.id, date.raw).projects.color_code })}" class="text-white text-xs p-1 rounded shadow-sm text-left truncate h-full flex flex-col justify-between"><span class="font-bold block truncate">${ssrInterpolate(getScheduleForResource("staff", s.id, date.raw).projects.name)}</span>`);
            if (getScheduleForResource("staff", s.id, date.raw).note) {
              _push(`<span class="text-[10px] opacity-90 truncate"> 📝${ssrInterpolate(getScheduleForResource("staff", s.id, date.raw).note)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td>`);
        });
        _push(`<!--]--></tr>`);
      });
      _push(`<!--]--><tr class="bg-slate-50"><td${ssrRenderAttr("colspan", dateRange.value.length + 1)} class="p-2 border-b border-gray-300 font-bold text-sm text-emerald-800 bg-emerald-50/50 sticky left-0"> 🚚 車両・重機（Vehicles）セクション </td></tr><!--[-->`);
      ssrRenderList(vehicleList.value, (v) => {
        _push(`<tr class="hover:bg-gray-50"><td class="p-3 border-b border-r border-gray-200 font-medium text-sm bg-white sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">${ssrInterpolate(v.name)} <span class="text-xs text-gray-400 block font-normal">${ssrInterpolate(v.type)}</span></td><!--[-->`);
        ssrRenderList(dateRange.value, (date) => {
          _push(`<td class="${ssrRenderClass(["p-1 border-b border-r border-gray-200 text-center h-14 relative", date.isToday ? "bg-amber-50/30" : ""])}">`);
          if (getScheduleForResource("vehicle", v.id, date.raw)) {
            _push(`<div style="${ssrRenderStyle({ backgroundColor: getScheduleForResource("vehicle", v.id, date.raw).projects.color_code })}" class="text-white text-xs p-1 rounded shadow-sm text-left truncate h-full flex flex-col justify-between"><span class="font-bold block truncate">${ssrInterpolate(getScheduleForResource("vehicle", v.id, date.raw).projects.name)}</span>`);
            if (getScheduleForResource("vehicle", v.id, date.raw).note) {
              _push(`<span class="text-[10px] opacity-90 truncate"> 📝${ssrInterpolate(getScheduleForResource("vehicle", v.id, date.raw).note)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td>`);
        });
        _push(`<!--]--></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div></main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B_AK9MbW.mjs.map
