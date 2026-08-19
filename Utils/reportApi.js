import axios from "axios";
import { getCookie, hasCookie } from "cookies-next";
import { Baseurl } from "./Constants";

export const extractList = (response) => {
  const payload = response?.data?.data ?? response?.data;
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const nestedKeys = [
    "rows",
    "opportunityData",
    "opportunities",
    "oppData",
    "opportunity_data",
    "accounts",
    "users",
    "list",
    "report",
    "result",
    "records",
    "items",
    "data",
  ];
  for (let i = 0; i < nestedKeys.length; i += 1) {
    if (Array.isArray(payload[nestedKeys[i]])) return payload[nestedKeys[i]];
  }
  if (
    payload.opp_name ||
    payload.assignedOpp ||
    payload.closed_won_opportunities != null ||
    payload.total_amount != null ||
    payload.avg_deal_size != null ||
    payload.average_days_difference != null
  ) {
    return [payload];
  }
  const values = Object.values(payload);
  const nestedArray = values.find((value) => Array.isArray(value));
  if (nestedArray) return nestedArray;
  if (
    values.length &&
    values.every((value) => value && typeof value === "object" && !Array.isArray(value))
  ) {
    return values;
  }
  return [];
};

export const getReportHeaders = (extra = {}) => ({
  headers: {
    Accept: "application/json",
    Authorization: "Bearer ".concat(getCookie("token")),
    db: getCookie("db_name"),
    ...extra,
  },
});

export const fetchReport = async (path) => {
  if (!hasCookie("token")) return [];
  const url = `${Baseurl}${String(path || "").trim()}`;
  const attempts = [{ pass: "pass" }, { m_id: 35, pass: "pass" }, { m_id: 35 }];
  let lastError = null;
  for (let i = 0; i < attempts.length; i += 1) {
    try {
      const response = await axios.get(url, getReportHeaders(attempts[i]));
      const list = extractList(response);
      if (list.length || i === attempts.length - 1) return list;
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return [];
};

const stageText = (item) =>
  String(
    item?.db_opportunity_stg?.opportunity_stg_name ||
      item?.opportunity_stg_name ||
      item?.stage ||
      ""
  ).toLowerCase();

export const isWonOpp = (item) => {
  const name = stageText(item);
  return (
    Number(item?.opportunity_stg_id) === 3 ||
    name.includes("won") ||
    (name.includes("closed") && !name.includes("lost"))
  );
};

export const isLostOpp = (item) => {
  const name = stageText(item);
  return Number(item?.opportunity_stg_id) === 4 || name.includes("lost");
};

export const isOpenOpp = (item) => !isWonOpp(item) && !isLostOpp(item);

export const isDueThisMonth = (item) => {
  if (!item?.close_date) return false;
  const closeDate = new Date(item.close_date);
  if (Number.isNaN(closeDate.getTime())) return false;
  const now = new Date();
  return closeDate.getMonth() === now.getMonth() && closeDate.getFullYear() === now.getFullYear();
};

export const cellText = (value, keys = []) => {
  if (value == null || value === "") return "";
  if (typeof value !== "object") return String(value);
  for (let i = 0; i < keys.length; i += 1) {
    if (value[keys[i]]) return value[keys[i]];
  }
  return "";
};

export const groupByAssignee = (opps = []) => {
  const map = {};
  opps.forEach((item) => {
    const userObj = item?.assignedOpp || item?.assigned_to || {};
    const key =
      (typeof userObj === "object" ? userObj?.user || userObj?.user_name : userObj) ||
      "Unassigned";
    if (!map[key]) {
      const assigned = typeof userObj === "object" ? { ...userObj, user: key } : { user: key };
      map[key] = {
        assignedOpp: assigned,
        assigned_to: assigned,
        total_amount: 0,
        count: 0,
        days: 0,
        closed_won_opportunities: 0,
        total_opportunities: 0,
      };
    }
    map[key].total_amount += Number(item?.amount || item?.total_amount || 0);
    map[key].count += 1;
    map[key].total_opportunities += 1;
    if (isWonOpp(item)) map[key].closed_won_opportunities += 1;
    if (item?.createdAt && item?.close_date) {
      const days = Math.abs(new Date(item.close_date) - new Date(item.createdAt)) / 86400000;
      if (Number.isFinite(days)) map[key].days += days;
    }
  });
  return Object.values(map).map((row) => ({
    ...row,
    avg_deal_size: row.count ? row.total_amount / row.count : 0,
    average_days_difference: row.count ? row.days / row.count : 0,
  }));
};

export const mapOpportunityRow = (item = {}) => ({
  ...item,
  opp_name: item?.opp_name || item?.opportunity_name || "",
  accName:
    item?.accName?.acc_name ||
    item?.accName ||
    item?.account_name ||
    item?.db_account?.acc_name ||
    "",
  amount: item?.amount ?? item?.total_amount ?? "",
  assignedOpp:
    item?.assignedOpp?.user ||
    item?.assignedOpp?.user_name ||
    (typeof item?.assignedOpp === "string" ? item.assignedOpp : "") ||
    item?.assigned_to?.user ||
    (typeof item?.assigned_to === "string" ? item.assigned_to : "") ||
    "",
  close_date: item?.close_date,
  db_opportunity_stg:
    item?.db_opportunity_stg?.opportunity_stg_name ||
    (typeof item?.db_opportunity_stg === "string" ? item.db_opportunity_stg : "") ||
    item?.opportunity_stg_name ||
    "",
  db_opportunity_type:
    item?.db_opportunity_type?.opportunity_type_name ||
    (typeof item?.db_opportunity_type === "string" ? item.db_opportunity_type : "") ||
    item?.opportunity_type_name ||
    "",
  db_lead_source:
    item?.db_lead_source?.source ||
    (typeof item?.db_lead_source === "string" ? item.db_lead_source : "") ||
    item?.source ||
    "",
  desc: item?.desc || item?.description || "",
  createdAt: item?.createdAt,
  updatedAt: item?.updatedAt,
});

export const loadOpportunityReport = async (
  reportPath,
  { filter, group, allowUnfilteredFallback = true } = {}
) => {
  let list = [];
  try {
    list = await fetchReport(reportPath);
  } catch (error) {
    list = [];
  }

  const all = list.length ? list : await fetchReport("/db/opportunity");
  if (!list.length) {
    list = all;
  }

  if (filter) {
    const filtered = list.filter(filter);
    list = filtered.length ? filtered : allowUnfilteredFallback ? all : filtered;
  }

  if (group && list.length) {
    const sample = list[0];
    const alreadyGrouped =
      sample.total_amount != null ||
      sample.avg_deal_size != null ||
      sample.closed_won_opportunities != null ||
      sample.average_days_difference != null;
    if (!alreadyGrouped) list = group(list);
  }

  return Array.isArray(list) ? list : [];
};

export const looksLikeTargetRow = (item = {}) =>
  item.target != null ||
  item.target_amount != null ||
  item.sales_target != null ||
  item.achievement != null ||
  item.achieved != null ||
  item.achieved_amount != null;

const TARGET_KEY = /target/i;

export const pickTargetValue = (item = {}) => {
  if (!item || typeof item !== "object") return 0;
  const known = [
    item.target,
    item.target_amount,
    item.target_value,
    item.sales_target,
    item.user_target,
    item.assigned_target,
    item.yearly_target,
    item.monthly_target,
    item.quarterly_target,
    item.fy_target,
    item.q_target,
  ];
  for (let i = 0; i < known.length; i += 1) {
    const num = Number(known[i]);
    if (Number.isFinite(num) && num > 0) return num;
  }
  const keys = Object.keys(item);
  for (let i = 0; i < keys.length; i += 1) {
    if (!TARGET_KEY.test(keys[i])) continue;
    const num = Number(item[keys[i]]);
    if (Number.isFinite(num) && num > 0) return num;
  }
  const fields = item.db_user_fields || item.user_fields || item.fields || [];
  if (Array.isArray(fields)) {
    for (let i = 0; i < fields.length; i += 1) {
      const field = fields[i] || {};
      const label = String(
        field.field_lable || field.field_label || field.field_name || field.lable || ""
      ).toLowerCase();
      if (!label.includes("target")) continue;
      const num = Number(field.input_value || field.value || field.field_value);
      if (Number.isFinite(num) && num > 0) return num;
    }
  }
  return 0;
};

export const normalizeTargetRow = (item = {}) => {
  const name =
    item?.assignedOpp?.user ||
    item?.assigned_to?.user ||
    item?.user ||
    item?.user_name ||
    item?.name ||
    "Unassigned";
  const target = pickTargetValue(item) || Number(item.target || 0);
  const achievement = Number(
    item.achievement ??
      item.achieved ??
      item.achieved_amount ??
      item.total_amount ??
      item.amount ??
      0
  );
  const hasTarget = Number(target) > 0;
  return {
    assignedOpp: { user: name },
    user: name,
    target: hasTarget ? target : 0,
    target_set: hasTarget,
    achievement,
    gap: hasTarget ? achievement - target : achievement,
    achievement_percent: hasTarget ? (achievement / target) * 100 : null,
  };
};

export const buildTargetVsAchievement = (users = [], opps = [], targetRows = []) => {
  const won = (opps || []).filter(isWonOpp);
  const source = won.length ? won : opps || [];
  const grouped = groupByAssignee(source);
  const achievedByName = {};
  const achievedById = {};
  grouped.forEach((row) => {
    const name = row.assignedOpp?.user || "Unassigned";
    achievedByName[String(name).toLowerCase()] = Number(row.total_amount || 0);
    const userId = row.assignedOpp?.user_id;
    if (userId != null) achievedById[String(userId)] = Number(row.total_amount || 0);
  });

  const extraTargetById = {};
  const extraTargetByName = {};
  (Array.isArray(targetRows) ? targetRows : []).forEach((row) => {
    const value = pickTargetValue(row);
    if (!value) return;
    const userId = row.user_id || row.assigned_to || row.u_id || row.opp_owner;
    const name = String(
      row.user || row.user_name || row.assignedOpp?.user || row.name || ""
    ).toLowerCase();
    if (userId != null) extraTargetById[String(userId)] = value;
    if (name) extraTargetByName[name] = value;
  });

  const userList = Array.isArray(users) ? users : [];
  if (userList.length) {
    return userList
      .filter((user) => user && (user.user || user.user_name || user.email))
      .map((user) => {
        const name = user.user || user.user_name || user.email;
        const achievement =
          achievedById[String(user.user_id)] ??
          achievedByName[String(name).toLowerCase()] ??
          0;
        const target =
          pickTargetValue(user) ||
          extraTargetById[String(user.user_id)] ||
          extraTargetByName[String(name).toLowerCase()] ||
          0;
        return normalizeTargetRow({
          assignedOpp: { user: name, user_id: user.user_id },
          target,
          achievement,
        });
      });
  }

  return grouped.map((row) => {
    const name = row.assignedOpp?.user || "Unassigned";
    return normalizeTargetRow({
      assignedOpp: row.assignedOpp,
      target:
        extraTargetById[String(row.assignedOpp?.user_id)] ||
        extraTargetByName[String(name).toLowerCase()] ||
        0,
      achievement: row.total_amount,
    });
  });
};

export const loadTargetVsAchievement = async () => {
  const reportPaths = [
    "/db/opportunity/opportunityReport?type=target_vs_achievement",
    "/db/opportunity/opportunityReport?type=target",
    "/db/target",
    "/db/targets",
    "/db/user/target",
    "/db/users/target",
  ];

  for (let i = 0; i < reportPaths.length; i += 1) {
    try {
      const list = await fetchReport(reportPaths[i]);
      if (list.length && looksLikeTargetRow(list[0]) && pickTargetValue(list[0]) > 0) {
        return list.map(normalizeTargetRow);
      }
    } catch (error) {
      // Try the next endpoint if this report API is missing.
    }
  }

  let users = [];
  let opps = [];
  let targetRows = [];
  try {
    users = await fetchReport("/db/users");
  } catch (error) {
    users = [];
  }
  if (!users.length) {
    try {
      users = await fetchReport("/db/users?mode=ul");
    } catch (error) {
      users = [];
    }
  }
  try {
    opps = await fetchReport("/db/opportunity");
  } catch (error) {
    opps = [];
  }
  const extraTargetPaths = ["/db/target", "/db/targets", "/db/user/target"];
  for (let i = 0; i < extraTargetPaths.length; i += 1) {
    try {
      const list = await fetchReport(extraTargetPaths[i]);
      if (list.length) {
        targetRows = list;
        break;
      }
    } catch (error) {
      // continue
    }
  }
  return buildTargetVsAchievement(users, opps, targetRows);
};

export const getActivityOwner = (item = {}) => {
  const obj =
    item.assignedToUser ||
    item.assigned_to ||
    item.db_user ||
    item.createdBy ||
    item.created_by ||
    item.assignedOpp ||
    {};
  const name =
    (typeof obj === "object" ? obj.user || obj.user_name : obj) ||
    item.user ||
    item.user_name ||
    item.created_by_name ||
    "Unassigned";
  const userId =
    (typeof obj === "object" ? obj.user_id : null) ||
    item.user_id ||
    item.assigned_to ||
    item.created_by;
  return { name: String(name || "Unassigned"), userId };
};

const countByUser = (list = []) => {
  const byId = {};
  const byName = {};
  list.forEach((item) => {
    const { name, userId } = getActivityOwner(item);
    const key = String(name).toLowerCase();
    byName[key] = (byName[key] || 0) + 1;
    if (userId != null) byId[String(userId)] = (byId[String(userId)] || 0) + 1;
  });
  return { byId, byName };
};

const pickCount = (maps, user) => {
  const name = String(user.user || user.user_name || user.email || "").toLowerCase();
  return maps.byId[String(user.user_id)] ?? maps.byName[name] ?? 0;
};

export const looksLikeDailyActivityRow = (item = {}) =>
  item.leads != null ||
  item.lead_count != null ||
  item.tasks != null ||
  item.task_count != null ||
  item.calls != null ||
  item.events != null ||
  item.meetings != null ||
  item.opportunities != null;

export const normalizeDailyActivityRow = (item = {}) => {
  const name =
    item?.assignedOpp?.user ||
    item?.user ||
    item?.user_name ||
    item?.name ||
    "Unassigned";
  const leads = Number(item.leads ?? item.lead_count ?? 0);
  const tasks = Number(item.tasks ?? item.task_count ?? 0);
  const events = Number(item.events ?? item.calls ?? item.meetings ?? item.event_count ?? 0);
  const opportunities = Number(item.opportunities ?? item.opportunity_count ?? 0);
  return {
    assignedOpp: { user: name },
    user: name,
    leads,
    tasks,
    events,
    opportunities,
    total: leads + tasks + events + opportunities,
  };
};

export const buildDailyActivity = (users = [], leads = [], tasks = [], events = [], opps = []) => {
  const leadCounts = countByUser(leads);
  const taskCounts = countByUser(tasks);
  const eventCounts = countByUser(events);
  const oppCounts = countByUser(opps);
  const userList = Array.isArray(users) ? users : [];

  if (userList.length) {
    return userList
      .filter((user) => user && (user.user || user.user_name || user.email))
      .map((user) => {
        const name = user.user || user.user_name || user.email;
        return normalizeDailyActivityRow({
          assignedOpp: { user: name, user_id: user.user_id },
          leads: pickCount(leadCounts, user),
          tasks: pickCount(taskCounts, user),
          events: pickCount(eventCounts, user),
          opportunities: pickCount(oppCounts, user),
        });
      });
  }

  const names = new Set([
    ...Object.keys(leadCounts.byName),
    ...Object.keys(taskCounts.byName),
    ...Object.keys(eventCounts.byName),
    ...Object.keys(oppCounts.byName),
  ]);
  return Array.from(names).map((name) =>
    normalizeDailyActivityRow({
      user: name,
      leads: leadCounts.byName[name] || 0,
      tasks: taskCounts.byName[name] || 0,
      events: eventCounts.byName[name] || 0,
      opportunities: oppCounts.byName[name] || 0,
    })
  );
};

const safeFetchList = async (path) => {
  try {
    return await fetchReport(path);
  } catch (error) {
    return [];
  }
};

export const loadDailyActivity = async () => {
  const reportPaths = [
    "/db/opportunity/opportunityReport?type=daily_activity",
    "/db/activity",
    "/db/reports/dailyActivity",
    "/db/dailyActivity",
  ];

  for (let i = 0; i < reportPaths.length; i += 1) {
    const list = await safeFetchList(reportPaths[i]);
    if (list.length && looksLikeDailyActivityRow(list[0])) {
      return list.map(normalizeDailyActivityRow);
    }
  }

  const [users, leads, tasks, events, opps] = await Promise.all([
    safeFetchList("/db/users"),
    safeFetchList("/db/leads"),
    safeFetchList("/db/tasks"),
    safeFetchList("/db/leads/calls"),
    safeFetchList("/db/opportunity"),
  ]);
  const userList = users.length ? users : await safeFetchList("/db/users?mode=ul");
  return buildDailyActivity(userList, leads, tasks, events, opps);
};
