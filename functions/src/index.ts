import * as functions from "firebase-functions";
import algoliasearch from "algoliasearch";

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;

const ALGOLIA_INDEX_NAME = "algolia-firestore";
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

// Update the search index every time a blog post is written.
exports.onQuestionCreated =
  functions.firestore.document("questions/{questionId}").onCreate(
      (snap, context) => {
        // Get the note document
        const question = snap.data();

        // Add an 'objectID' field which Algolia requires
        question.objectID = context.params.questionId;

        // Write to the algolia index
        const index = client.initIndex(ALGOLIA_INDEX_NAME);
        return index.saveObject(question);
      }
  );
