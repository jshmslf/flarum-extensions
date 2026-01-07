import app from 'flarum/admin/app';
import CustomAdsPage from './components/CustomAdsPage';

app.initializers.add('knowz/custom-ads', () => {
  app.extensionData
    .for('knowz-custom-ads')
    .registerPage(CustomAdsPage);
});