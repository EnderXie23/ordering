export enum FinishState {
    Done = 'done',
    Processing = 'processing',
    Rejected = 'rejected',
}


export function getFinishStateName(state: FinishState): string {
    switch (state) {
        case FinishState.Done: return '已完成';
        case FinishState.Processing: return '进行中';
        case FinishState.Rejected: return '已取消';
        default: return '未知';
    }
}