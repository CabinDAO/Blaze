import { Client, PrivateKey, UserAuth, ThreadID, QueryJSON } from '@textile/hub';

const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    
};

export const setupThreadClient = async (auth: UserAuth) => {
    const user = await PrivateKey.fromRandom();
    const client = await Client.withUserAuth(auth);
    return client;
};

export const newUserToken = async (client: Client, user: PrivateKey) => {
    const token = await client.getToken(user);
    return token;
}

export const createDB = async (client: Client) => {
    const thread: ThreadID = await client.newDB()
    return thread;
}

export const createCollection = async (client: Client, threadID: ThreadID, collectionName: string, schema: any) => {
    const collection = await client.newCollection(threadID, { name: collectionName, schema: schema });
}

export const createInstance = async (client: Client, threadID: ThreadID, collectionName: string, data: any) => {
    const created = await client.create(threadID, collectionName, data);
    return created;
}

export const createQuery = (client: Client, collectionName: string, threadID: ThreadID, query: QueryJSON) => {
    const results = client.find(threadID, collectionName, query);
    return results;
}

