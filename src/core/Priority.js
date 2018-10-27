import { List as ImmutableList, Record } from 'immutable';

const Priority = Record({ id: '', key: '', name: '' });

export const defaultPriority = new Priority({ id: 'none', key: 1, name: 'No Priority' });
export const priorities = new ImmutableList([
    new Priority({ id: 'p1', key: 4, name: 'Priority 1' }),
    new Priority({ id: 'p2', key: 3, name: 'Priority 2' }),
    new Priority({ id: 'p3', key: 2, name: 'Priority 3' }),
    defaultPriority,
]);
