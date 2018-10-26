import { Record, List as ImmutableList } from 'immutable';

const ListRecord = Record({
    id: 0,
    title: '',
    items: ImmutableList.of(),
});

export default class List extends ListRecord {
    append(item) {
        if (this.items.findIndex(i => i.id === item.id) >= 0) return this;
        return new List({ id: this.id, title: this.title, items: this.items.push(item) });
    }

    prepend(item) {
        return new List({ id: this.id, title: this.title, items: this.items.insert(0, item) });
    }

    updateWith({ id, title, items }) {
        return new List({
            id: id || this.id,
            title: title || this.title,
            items: items || this.items,
        });
    }

    updateItem(item, newItem) {
        const index = this.items.findIndex(el => el.id === item.id);
        if (index < 0) {
            return this;
        }
        const { id, title } = this;
        return new List({ id, title, items: this.items.set(index, newItem) });
    }

    removeItem(item) {
        // Don't create a new List if item being removed is not in List.
        if (this.items.map(i => i.id).indexOf(item.id) < 0) return this;
        return new List({ id: this.id, title: this.title, items: this.items.filter(el => el.id !== item.id) });
    }

    setItems(items) {
        return new List({ id: this.id, title: this.title, items });
    }

    sort(sortFn) {
        return new List({ id: this.id, title: this.title, items: this.items.sort(sortFn) });
    }
}
