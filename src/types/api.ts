export interface ApiResponse<T>{
    success:boolean;
    message:string;
    data:T;
    statusCode:number;
    warnings:string[];
    error:{
        type:string;
        errors:string[];
    };
    links:string;
}