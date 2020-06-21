import { Record, List as ImmutableList } from 'immutable';

const ListRecord = Record({
    id: 0,
    title: '',
    value: '', // this is the value that exists inside items.labels = [*here*]
    items: ImmutableList.of(),
    isShared: false,
});

export default class List extends ListRecord {
    append(item) {
        if (this.items.findIndex(i => i.id === item.id) >= 0) return this;
        return new List({ id: this.id, title: this.title, value: this.value, isShared: this.isShared, items: this.items.push(item) });
    }

    prepend(item) {
        return new List({ id: this.id, title: this.title, value: this.value, isShared: this.isShared, items: this.items.insert(0, item) });
    }

    insert(index, item) {
        return new List({ id: this.id, title: this.title, value: this.value, isShared: this.isShared, items: this.items.insert(index, item) })
    }

    updateWith({ id, title, items, isShared, value }) {
        return new List({
            id: id || this.id,
            title: title || this.title,
            items: items || this.items,
            isShared: isShared || this.isShared,
            value: value || this.value,
        });
    }

    updateItem(item, newItem) {
        const index = this.items.findIndex(el => el.id === item.id);
        if (index < 0) {
            return this;
        }
        const { id, title, isShared, value } = this;
        return new List({ id, title, isShared, value, items: this.items.set(index, newItem) });
    }

    removeItem(item) {
        // Don't create a new List if item being removed is not in List.
        if (this.items.map(i => i.id).indexOf(item.id) < 0) return this;
        return new List({ id: this.id, title: this.title, value: this.value, isShared: this.isShared, items: this.items.filter(el => el.id !== item.id) });
    }

    setItems(items) {
        return new List({ id: this.id, title: this.title, value: this.value, isShared: this.isShared,items });
    }

    sort(sortFn) {
        return new List({ id: this.id, title: this.title, value: this.value, isShared: this.isShared, items: this.items.sort(sortFn) });
    }
}
