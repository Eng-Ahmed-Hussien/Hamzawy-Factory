export const ok = (data: unknown) => ({ success: true, data });
export const fail = (message: string) => ({ success: false, message });