const SITE_TIME_ZONE = "Asia/Shanghai";

const siteDateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

export function getSiteDateParts(date: Date): { year: string; month: string; day: string } {
    const parts = siteDateFormatter.formatToParts(date);
    const year = parts.find((p) => p.type === "year")!.value;
    const month = parts.find((p) => p.type === "month")!.value;
    const day = parts.find((p) => p.type === "day")!.value;
    return { year, month, day };
}

export function formatSiteDate(date: Date): string {
    const { year, month, day } = getSiteDateParts(date);
    return `${year}-${month}-${day}`;
}
