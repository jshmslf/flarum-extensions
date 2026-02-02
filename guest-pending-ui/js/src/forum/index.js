import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import DiscussionComposer from 'flarum/forum/components/DiscussionComposer';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import SignUpModal from 'flarum/forum/components/SignUpModal';
import LogInModal from 'flarum/forum/components/LogInModal';
import Alert from 'flarum/common/components/Alert';
import { extend } from 'flarum/common/extend';

class GuestPendingModal extends Modal {
  className() {
    return 'GuestPendingModal Modal--small';
  }

  title() {
    return 'Thank you for posting!';
  }

  content() {
    return m('div.Modal-body', [
      m('div.guest-pending-box', [
        m(
          'p',
          'Your post is awaiting admin approval. You can sign up or log in to track its status and participate more fully in the community.'
        ),
        m('div.Button-group', [
          Button.component(
            {
              className: 'Button Button--primary',
              onclick: () => {
                app.modal.close();
                app.modal.show(SignUpModal);
              },
            },
            'Sign Up'
          ),
          Button.component(
            {
              className: 'Button',
              onclick: () => {
                app.modal.close();
                app.modal.show(LogInModal);
              },
            },
            'Log In'
          ),
          Button.component(
            {
              className: 'Button',
              onclick: () => app.modal.close(),
            },
            'Close'
          ),
        ]),
      ]),
    ]);
  }
}

app.initializers.add('knowz/guest-pending-ui', () => {
  let guestJustPosted = false;
  let suppress404 = false;

  // Mark that a guest has just submitted a discussion
  extend(DiscussionComposer.prototype, 'data', function () {
    if (!app.session.user) {
      guestJustPosted = true;
      suppress404 = true;
    }
  });

  // Suppress ONLY the 404 / Not Found alert
  extend(app.alerts, 'show', function (alert) {
    if (
      suppress404 &&
      alert instanceof Alert &&
      alert.attrs?.type === 'error' &&
      typeof alert.children === 'string' &&
      alert.children.toLowerCase().includes('not found')
    ) {
      return;
    }
  });

  // Intercept discussion page load after guest post
  extend(DiscussionPage.prototype, 'oninit', function () {
    if (guestJustPosted && !app.session.user) {
      guestJustPosted = false;

      // Go back home BEFORE page renders
      m.route.set('/');

      setTimeout(() => {
        app.modal.show(GuestPendingModal);

        // Re-enable alerts after modal appears
        setTimeout(() => {
          suppress404 = false;
        }, 500);
      }, 50);
    }
  });
});
