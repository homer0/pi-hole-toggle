import { ENABLED_ICON, DISABLED_ICON } from './icons';

export type RenderAppProps = {
  enabled: boolean;
};

export const renderApp = ({ enabled }: RenderAppProps): JSX.Element => {
  const icon = enabled ? ENABLED_ICON : DISABLED_ICON;
  return (
    <div id="app">
      <div id="icon">{icon}</div>
      <div id="switch">
        <div class="vc-toggle-container">
          <label class="vc-switch">
            <input type="checkbox" class="vc-switch-input" checked={enabled} />
            <span class="vc-switch-label" data-on="On" data-off="Off"></span>
            <span class="vc-handle"></span>
          </label>
        </div>
      </div>
    </div>
  );
};
