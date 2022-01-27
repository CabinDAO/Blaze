 const resolvers = {
    Query: {
        async links() {
            //get all links in orbitdb
        }
    },
     Mutuation: {
         upVoteLink: async (_, { id: id }) => {
           //get link in orbitdb
           const link = find(links, { id: id });
           if (!post) {
             throw new Error(`Couldn't find link with id ${id}`);
           }
             post.votes++;
             //save updated link in orbitdb
             return post;
         }
     },
     Profile: {
         async walletAddress(profile) {
             
         }
         }

 }
export default resolvers;