import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { TabMenuExample } from './TabMenuExample';
import tabMenuStyles from './TabMenuExample.module.css?raw';
import tabMenuSource from './TabMenuExample.tsx?raw';
import { WindowMenuExample } from './WindowMenuExample';
import windowMenuStyles from './WindowMenuExample.module.css?raw';
import windowMenuSource from './WindowMenuExample.tsx?raw';

export function WindowTabMenuPage() {
  return (
    <>
      <PageSection title="Opening">
        <p>
          Every group of tabs has a menu button at the right of its tabs. A right click on a tab, or
          Shift+F10 and the context menu key on a focused tab, opens the same menu for that tab. The
          button is an ordinary Tab stop; inside the menu the keyboard works as in any menu.
        </p>
      </PageSection>
      <PageSection title="Items">
        <p>The framework always adds its items at the end of the menu:</p>
        <ul>
          <li>Maximize, checked while the group is maximized. It restores the layout again.</li>
          <li>Close tab.</li>
          <li>
            Add tab, a submenu with every registered window type. The window opens in the group of
            the tab. A single-instance window that is already open is disabled.
          </li>
        </ul>
        <p>
          A window adds its own items before them. <code>defineWindow</code> gives every window type
          a context menu of its own, <code>windowType.tabMenu</code>, and the integration registers
          items into it with <code>contextMenus.registerItem</code>, the same way as into any
          context menu. The target of the menu is <code>{'{ windowId, windowType }'}</code>, so a
          command declared as <code>{'defineCommand<WindowTabTarget>'}</code> knows which instance
          it serves. The paths <code>maximize</code>, <code>close-tab</code> and{' '}
          <code>add-tab</code> belong to the framework.
        </p>
        <p>
          A multi-instance window registers the handler of its items once, together with the window
          type, and tells the instances apart by <code>target.windowId</code>. In the example every
          Inspector is locked on its own.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'TabMenuExample.tsx', code: tabMenuSource },
            { fileName: 'TabMenuExample.module.css', code: tabMenuStyles },
          ]}
        >
          <TabMenuExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Window menu">
        <p>
          The framework does not create a Window menu. It gives{' '}
          <code>{'registerWindowMenuItems(editor, { menuPath, group })'}</code>, which adds an item
          for every registered window type to the menu at <code>menuPath</code> and follows window
          types registered and removed later. The item calls <code>workspace.open</code>: it opens
          the window or activates the open one. The integration places the menu itself and adds
          other items next to it, such as <code>resetLayoutCommand</code>.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'WindowMenuExample.tsx', code: windowMenuSource },
            { fileName: 'WindowMenuExample.module.css', code: windowMenuStyles },
          ]}
        >
          <WindowMenuExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Shortcuts">
        <ul>
          <li>Shift+Space maximizes the active window and restores the layout.</li>
          <li>Alt+PageDown and Alt+PageUp switch to the next and previous tab of the group.</li>
          <li>
            F6 and Shift+F6 move the focus between the areas of the editor: the menu, the toolbar,
            the active window and the status bar.
          </li>
        </ul>
        <p>The Hotkeys page explains how these shortcuts behave in fields and on buttons.</p>
      </PageSection>
    </>
  );
}
