export interface Message {
    fcn: string;
    target?: 'fcontent' | 'finpage';
    url?: string;
    params?: any;
}

export interface ChaincodeMessage {
    chaincodeId: string;
    fcn: string;
    args: string[];
}