import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

export default class CustomAdsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = true;
    this.ads = [];
    this.editingAd = null;
    this.loadAds();
  }

  loadAds() {
    this.loading = true;
    app.request({
      method: 'GET',
      url: app.forum.attribute('apiUrl') + '/custom-ads',
    }).then(response => {
      this.ads = response.data || [];
      this.loading = false;
      m.redraw();
    });
  }

  content() {
    if (this.loading) {
      return <LoadingIndicator />;
    }

    return (
      <div className="CustomAdsPage">
        <div className="container">
          <h2>Manage Custom Ads</h2>
          
          <Button
            className="Button Button--primary"
            onclick={() => this.showAdForm(null)}
          >
            Add New Ad
          </Button>

          {this.editingAd !== null && this.adForm()}

          <div className="CustomAds-list" style="margin-top: 20px;">
            {this.ads.length === 0 ? (
              <p>No ads created yet. Click "Add New Ad" to create one.</p>
            ) : (
              <table className="Table" style="width: 100%;">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>URL</th>
                    <th>Status</th>
                    <th>Position</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.ads.map(ad => (
                    <tr key={ad.id}>
                      <td>{ad.attributes.title}</td>
                      <td>
                        <a href={ad.attributes.url} target="_blank" rel="noopener noreferrer">
                          {ad.attributes.url.substring(0, 50)}...
                        </a>
                      </td>
                      <td>
                        <span className={ad.attributes.isActive ? 'Badge Badge--success' : 'Badge'}>
                          {ad.attributes.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{ad.attributes.position}</td>
                      <td>
                        <Button
                          className="Button Button--link"
                          onclick={() => this.showAdForm(ad)}
                        >
                          Edit
                        </Button>
                        {' '}
                        <Button
                          className="Button Button--link"
                          onclick={() => this.deleteAd(ad)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }

  showAdForm(ad) {
    this.editingAd = ad || {
      id: null,
      attributes: {
        title: '',
        description: '',
        imageUrl: '',
        url: '',
        position: 0,
        isActive: true,
      }
    };
  }

  adForm() {
    const ad = this.editingAd;
    const isNew = !ad.id;

    return (
      <div className="Form" style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <h3>{isNew ? 'Add New Ad' : 'Edit Ad'}</h3>
        
        <div className="Form-group">
          <label>Title *</label>
          <input
            className="FormControl"
            type="text"
            value={ad.attributes.title}
            oninput={(e) => ad.attributes.title = e.target.value}
            placeholder="Enter ad title"
          />
        </div>

        <div className="Form-group">
          <label>Description *</label>
          <textarea
            className="FormControl"
            rows="3"
            value={ad.attributes.description}
            oninput={(e) => ad.attributes.description = e.target.value}
            placeholder="Enter ad description"
          />
        </div>

        <div className="Form-group">
          <label>Image URL *</label>
          <input
            className="FormControl"
            type="text"
            value={ad.attributes.imageUrl}
            oninput={(e) => ad.attributes.imageUrl = e.target.value}
            placeholder="https://example.com/image.jpg"
          />
          <small>Tip: Use /assets/extensions/knowz-custom-ads/images/yourimage.jpg for local images</small>
        </div>

        <div className="Form-group">
          <label>Link URL *</label>
          <input
            className="FormControl"
            type="text"
            value={ad.attributes.url}
            oninput={(e) => ad.attributes.url = e.target.value}
            placeholder="https://example.com"
          />
        </div>

        <div className="Form-group">
          <label>Position (lower numbers appear first)</label>
          <input
            className="FormControl"
            type="number"
            value={ad.attributes.position}
            oninput={(e) => ad.attributes.position = parseInt(e.target.value) || 0}
          />
        </div>

        <div className="Form-group">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={ad.attributes.isActive}
              onchange={(e) => ad.attributes.isActive = e.target.checked}
            />
            Active (show this ad on the forum)
          </label>
        </div>

        <Button
          className="Button Button--primary"
          onclick={() => this.saveAd(ad, isNew)}
        >
          {isNew ? 'Create Ad' : 'Save Changes'}
        </Button>
        {' '}
        <Button
          className="Button"
          onclick={() => this.editingAd = null}
        >
          Cancel
        </Button>
      </div>
    );
  }

  saveAd(ad, isNew) {
    if (!ad.attributes.title || !ad.attributes.description || !ad.attributes.imageUrl || !ad.attributes.url) {
      app.alerts.show({ type: 'error' }, 'Please fill in all required fields');
      return;
    }

    const method = isNew ? 'POST' : 'PATCH';
    const url = isNew
      ? app.forum.attribute('apiUrl') + '/custom-ads'
      : app.forum.attribute('apiUrl') + '/custom-ads/' + ad.id;

    app.request({
      method,
      url,
      body: { data: { attributes: ad.attributes } },
    }).then(() => {
      this.editingAd = null;
      this.loadAds();
      app.alerts.show({ type: 'success' }, isNew ? 'Ad created successfully!' : 'Ad updated successfully!');
    }).catch(() => {
      app.alerts.show({ type: 'error' }, 'Failed to save ad. Please try again.');
    });
  }

  deleteAd(ad) {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    app.request({
      method: 'DELETE',
      url: app.forum.attribute('apiUrl') + '/custom-ads/' + ad.id,
    }).then(() => {
      this.loadAds();
      app.alerts.show({ type: 'success' }, 'Ad deleted successfully!');
    }).catch(() => {
      app.alerts.show({ type: 'error' }, 'Failed to delete ad. Please try again.');
    });
  }
}