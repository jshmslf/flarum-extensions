import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import DiscussionComposer from 'flarum/forum/components/DiscussionComposer';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import SignUpModal from 'flarum/forum/components/SignUpModal';
import { extend, override } from 'flarum/common/extend';

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
                m('p', 'Your post is awaiting admin approval. In the meantime, please consider signing up for an account to stay updated on the status of your post and to participate more fully in the community.'),
                m('div.Button-group', [
                    Button.component({
                        className: 'Button Button--primary',
                        onclick: () => {
                            app.modal.close();
                            app.modal.show(SignUpModal);
                        }
                    }, 'Sign Up'),
                    Button.component({
                        className: 'Button',
                        onclick: () => {
                            app.modal.close();
                        }
                    }, 'Close')
                ])
            ])
        ]);
    }
}

app.initializers.add('knowz/guest-pending-ui', () => {
    let guestJustPosted = false;
    let suppressErrors = false;

    // Track when guest submits
    extend(DiscussionComposer.prototype, 'data', function (data) {
        if (!app.session.user) {
            guestJustPosted = true;
            suppressErrors = true;
        }
    });

    // Suppress error alerts for guests who just posted
    extend(app.alerts, 'show', function (component) {
        if (suppressErrors && component && component.attrs && component.attrs.type === 'error') {
            // Don't show error alerts
            return;
        }
    });

    // Prevent navigation to discussion page for guests who just posted
    extend(DiscussionPage.prototype, 'oninit', function () {
        if (guestJustPosted && !app.session.user) {
            guestJustPosted = false;
            
            // Redirect to home
            m.route.set('/');
            
            // Show modal and reset error suppression after modal shows
            setTimeout(() => {
                app.modal.show(GuestPendingModal);
                // Reset error suppression after a delay
                setTimeout(() => {
                    suppressErrors = false;
                }, 1000);
            }, 100);
        }
    });
});