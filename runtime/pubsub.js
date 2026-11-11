const topics = new Map();

export const subscribe = (topic, cb) => {
    if (!topics.has(topic)) topics.set(topic, []);
    topics.get(topic).push(cb);
};

export const unsubscribe = (topic, cb) => {
    if (!topics.has(topic)) return;
    const subs = topics.get(topic).filter((s) => s !== cb);
    topics.set(topic, subs);
};

export const publish = (topic, msg) => {
    const subs = topics.get(topic) || [];
    for (const cb of subs) cb(msg);
};

export const clearTopic = (topic) => {
    topics.delete(topic);
};
