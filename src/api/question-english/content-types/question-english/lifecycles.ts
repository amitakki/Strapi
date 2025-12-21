export default {
  async beforeCreate(event) {
    const data = event.params.data;

    if (data.questionId) return;

    const count = await strapi.db
      .query('api::question-english.question-english')
      .count();

    data.questionId = `ENG_MC_${String(count + 1).padStart(3, '0')}`;
  },
};
