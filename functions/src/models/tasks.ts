export interface Task {
    id?: string; // this is included in a periodic task
    time: number; // the server time in ms that the task should execute at.
    interval?: number; // this is the interval to run. on a periodic task
    runs?: number; // this is the number of runs an interval task has occurred.
    worker: string; // the worker that will run for this task.
    opts: any; // optional parameters based on the task type.
}

export interface transitionSiteStateTask extends Task {
    currentState?: WebsiteState; // this is the current state of the website
    worker: TaskWorkers.TRANSITION_SITE_STATE; // this is the the worker to run
}

export enum WebsiteState {
    CFP = '1',
    EarlyBird = '2'
}

export enum TaskWorkers {
    FETCH_CATEGORIES = 'fetchCategories',
    FETCH_MX_INSTITUTIONS = 'fetchInstitutions',
    INITIALIZE_AGGREGATION = 'initializeAggregation',
    APPROVE_BUDGET = 'approveBudget',
    UPDATE_CURRENT_MONTH = 'updateCurrentMonth',
    TRANSITION_SITE_STATE = 'transitionSiteState'
}
