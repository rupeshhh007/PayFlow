export const PLAN_STORAGE_KEY = "payflow_plan";
export const PLAN_UPDATED_EVENT = "payflow:plan-updated";

export const FREE_PLAN = {
  tier: "free",
  billingCycle: null,
  upgradedAt: null,
};

export const getStoredPlan = () => {
  try {
    const rawPlan = localStorage.getItem(PLAN_STORAGE_KEY);

    if (!rawPlan) return FREE_PLAN;

    const parsedPlan = JSON.parse(rawPlan);

    if (parsedPlan?.tier !== "pro") {
      return FREE_PLAN;
    }

    return {
      tier: "pro",
      billingCycle:
        parsedPlan.billingCycle === "yearly" ? "yearly" : "monthly",
      upgradedAt:
        typeof parsedPlan.upgradedAt === "string"
          ? parsedPlan.upgradedAt
          : new Date().toISOString(),
    };
  } catch {
    return FREE_PLAN;
  }
};

export const saveStoredPlan = (plan) => {
  const nextPlan =
    plan?.tier === "pro"
      ? {
          tier: "pro",
          billingCycle: plan.billingCycle === "yearly" ? "yearly" : "monthly",
          upgradedAt:
            typeof plan.upgradedAt === "string"
              ? plan.upgradedAt
              : new Date().toISOString(),
        }
      : FREE_PLAN;

  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(nextPlan));
  window.dispatchEvent(
    new CustomEvent(PLAN_UPDATED_EVENT, {
      detail: nextPlan,
    })
  );

  return nextPlan;
};
