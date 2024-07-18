export type GeneralResponse<T> = {
    success: boolean;
    errors_message:  null | string;
    data: T | null;
}
