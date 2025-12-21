export default {
    async beforeCreate(event) {
      const data = event.params.data;
  
      if (data.questionId) return;
  
      const count = await strapi.db
        .query('api::question-maths.question-maths')
        .count();
  
      data.questionId = `MATHS_MC_${String(count + 1).padStart(3, '0')}`;
    },
  };  