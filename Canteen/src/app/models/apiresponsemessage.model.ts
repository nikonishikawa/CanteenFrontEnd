export interface ApiResponseMessage<T>{
    data: T;
    message: string;
    isSuccess: boolean;
}