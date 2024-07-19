export enum FinishState {
    Done = 'done',
    Processing = 'processing',
    Rejected = 'rejected',
    SpecialMark = '2'
}


export function getFinishStateName(state: FinishState): string {
    switch (state) {
        case FinishState.Done: return '已完成';
        case FinishState.Processing: return '进行中';
        case FinishState.Rejected: return '已取消';
        case FinishState.SpecialMark: return '2';
        default: return '未知';
    }
}

export function ToString(state: FinishState): string {
    switch (state) {
        case FinishState.Done: return 'done';
        case FinishState.Processing: return 'processing';
        case FinishState.Rejected: return 'rejected';
        case FinishState.SpecialMark: return '2';
        default: return 'Unknown';
    }
}

export function decodeFinishState(state: string): FinishState {
    switch (state) {
        case 'Done': return FinishState.Done;
        case 'Processing': return FinishState.Processing;
        case 'Rejected': return FinishState.Rejected;
        case '2': return FinishState.SpecialMark;
        default: throw new Error(`Unknown state: ${state}`);
    }
}