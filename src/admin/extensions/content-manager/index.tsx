export default {
    bootstrap(app: any) {
      // Override default create button
      app.injectContentManagerComponent('editView', 'right-links', {
        name: 'create-with-wizard',
        Component: () => (
          <Button
            onClick={() => window.location.href = '/admin/plugins/question-wizard/create'}
            variant="secondary"
          >
            ✨ Create with Wizard
          </Button>
        ),
      });
    },
  };