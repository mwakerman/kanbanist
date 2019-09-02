import fetch from 'isomorphic-fetch';
import URLSearchParams from 'url-search-params';

/**
 * A (partial) todoist client for javascript.
 */

const SYNC_API_URL = 'https://api.todoist.com/sync/v8/sync';
const QUICK_ADD_API_URL = 'https://api.todoist.com/sync/v8/quick/add';

export default class Todoist {
    static getUser(apiToken) {
        if (apiToken.length < 40) {
            console.warn(`API Token: '${apiToken}' looks too short...`);
        }

        return fetch(`${SYNC_API_URL}?token=${apiToken}&resource_types=["user"]`)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    console.warn('response was not HTTP/200 when checking API token. response:', res);
                    return Promise.resolve({ error: 'could not get user' });
                }
            })
            .catch(err => {
                console.error('error getting user:', err);
            });
    }

    static getAvatarUrl = (image_id, size = 'medium') => {
        return `https://dcff1xvirvpfp.cloudfront.net/${image_id}_${size}.jpg`;
    };

    static fetch(apiToken) {
        return fetch(
            `${SYNC_API_URL}?token=${apiToken}&sync_token=*&resource_types=["labels","items","projects","collaborators"]`
        )
            .then(res => res.json())
            .then(todoistData => {
                // Labels
                let labels = todoistData['labels'];
                labels.sort((l1, l2) => l1.item_order - l2.item_order);
                labels.forEach(label => {
                    label.name = label.name.replaceAll('_', ' ').trim();
                });

                labels = labels.filter(label => label.is_deleted === 0);

                // Items
                const items = todoistData['items'];

                // Projects
                const projects = todoistData['projects'];
                projects.sort((p1, p2) => p1.item_order - p2.item_order);

                // Colaborators
                const collaborators = todoistData['collaborators'];

                return { labels, items, projects, collaborators };
            });
    }

    static updateItem(apiToken, updatedItem) {
        return Todoist.sendCommand(apiToken, Todoist.createCommand('item_update', updatedItem));
    }

    static addItem(apiToken, newItem, temp_id) {
        return Todoist.sendCommand(apiToken, Todoist.createCommand('item_add', newItem, temp_id));
    }

    static quickAddItem(apiToken, itemText) {
        const params = new URLSearchParams({
            token: apiToken,
            text: itemText,
        });
        const url = `${QUICK_ADD_API_URL}?${params.toString()}`;
        return fetch(url).then(res => res.json());
    }

    static addLabel(apiToken, newLabel, temp_id) {
        return Todoist.sendCommand(apiToken, Todoist.createCommand('label_add', newLabel, temp_id));
    }

    static updateLabelOrder(apiToken, labelOrdering) {
        return Todoist.sendCommand(
            apiToken,
            Todoist.createCommand('label_update_orders', { id_order_mapping: labelOrdering })
        );
    }

    static updateLabelName(apiToken, labelId, newLabelName) {
        return Todoist.sendCommand(
            apiToken,
            Todoist.createCommand('label_update', { id: labelId, name: newLabelName })
        );
    }

    static deleteLabel(apiToken, labelId) {
        return Todoist.sendCommand(apiToken, Todoist.createCommand('label_delete', { id: labelId }));
    }

    static completeListItem(apiToken, itemId) {
        return Todoist.completeListItems(apiToken, [itemId]);
    }

    static completeListItems(apiToken, itemsIds) {
        const commands = [];
        itemsIds.forEach(id => commands.push(Todoist.createCommand('item_close', { id, force_history: 0 })));
        return Todoist.sendCommands(apiToken, commands);
    }

    static createCommand(type, args, temp_id = undefined) {
        // Note: a value of `undefined` is ignored by JSON.stringify
        return {
            type: type,
            uuid: window.generateUUID(),
            args: args,
            temp_id: temp_id,
        };
    }

    static sendCommand(apiToken, command) {
        return Todoist.sendCommands(apiToken, [command]);
    }

    static sendCommands(apiToken, commands = []) {
        if (commands.length <= 0) {
            console.warn('No commands provided, nothing to send. ', { commands });
            return new Promise((resolve, reject) => {
                reject({ error: 'NO_COMMANDS_PROVIDED' });
            });
        }
        const url = `${SYNC_API_URL}?token=${apiToken}&commands=${JSON.stringify(commands)}`;
        return fetch(url)
            .then(resp => resp.json())
            .catch(err => console.error('Error sending commands: ', err));
    }
}
