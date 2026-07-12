import test from 'node:test';
import assert from 'node:assert/strict';
import {initializeApp,deleteApp} from 'firebase/app';
import {getFirestore,doc,collection,query,where} from 'firebase/firestore';

test('the retained Firebase SDK loads and builds document/query references offline',async()=>{
  const app=initializeApp({projectId:'demo-travel-planner'},'offline-sdk-check');
  try {
    const database=getFirestore(app);
    assert.equal(doc(database,'trips','example').path,'trips/example');
    assert.equal(query(collection(database,'trips'),where('owner','==','example')).firestore,database);
  } finally {
    await deleteApp(app);
  }
});
