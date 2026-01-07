import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import icon from 'flarum/common/helpers/icon';

app.initializers.add('knowz/custom-ads', () => {
  let ads = [];
  let loaded = false;
  let loading = false;
  let isVisible = true; // Default: ads are visible

  extend(IndexPage.prototype, 'view', function (vdom) {
    // Fetch ads from API only once
    if (!loading && !loaded) {
      loading = true;
      app.request({
        method: 'GET',
        url: app.forum.attribute('apiUrl') + '/custom-ads',
      }).then(response => {
        ads = response.data.map(ad => ({
          title: ad.attributes.title,
          description: ad.attributes.description,
          image: ad.attributes.imageUrl,
          url: ad.attributes.url,
        }));
        loaded = true;
        m.redraw();
      }).catch(error => {
        console.error('Failed to load custom ads:', error);
        loading = false;
      });
    }

    if (!loaded || ads.length === 0) return;

    const headerIndex = vdom.children.findIndex(
      child => child.attrs && child.attrs.className && child.attrs.className.includes('App-title')
    );

    const insertIndex = headerIndex !== -1 ? headerIndex + 1 : 0;

    const adsElement = (
      <div className={`knowz-ads-container ${isVisible ? 'is-visible' : 'is-hidden'}`}>
        <button
          className="knowz-ads-toggle"
          onclick={() => {
            isVisible = !isVisible;
            m.redraw();
          }}
          title={isVisible ? 'Hide ads' : 'Show ads'}
        >
          <span>{isVisible ? 'Hide ads' : 'Show ads'}</span>
          {icon(isVisible ? 'fas fa-chevron-up' : 'fas fa-chevron-down')}
        </button>

        <div className="knowz-ads-wrapper">
          <div className="knowz-ads-content">
            <div className="knowz-ads-grid">
              {ads.map((ad, index) => (
                <a
                  key={index}
                  href={ad.url}
                  className="knowz-ad-card"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundImage: `url(${ad.image})` }}
                >
                  <div className="knowz-ad-content">
                    <h4>{ad.title}</h4>
                    <p>{ad.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

    vdom.children.splice(insertIndex, 0, adsElement);
  });
});