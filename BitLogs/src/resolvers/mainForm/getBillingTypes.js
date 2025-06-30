import api, { route } from "@forge/api";

const BILLING_FIELD_ID = "customfield_10154"; // ← Sustituye por el ID real

export const getBillingTypes = async () => {
  try {
    const contextResponse = await api
      .asUser()
      .requestJira(route`/rest/api/3/field/${BILLING_FIELD_ID}/context`);

    const contextData = await contextResponse.json();
    const contextId = contextData.values?.[0]?.id;
    if (!contextId) return [];

    const optionResponse = await api
      .asUser()
      .requestJira(
        route`/rest/api/3/field/${BILLING_FIELD_ID}/context/${contextId}/option`
      );

    const optionData = await optionResponse.json();
    return optionData.values.map((opt) => ({ id: opt.id, value: opt.value }));
  } catch (err) {
    console.error("Error fetching billing types:", err);
    return [];
  }
};
