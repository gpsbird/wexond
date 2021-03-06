import './scss/index.scss';
import { Tabs } from './models/tabs';
import { platform } from 'os';
import { closeWindow, maximizeWindow, minimizeWindow } from './utils';
import { TabGroups } from './models/tab-groups';
import { ipcRenderer } from 'electron';

export class App {
  public tabs = new Tabs();
  public tabGroups = new TabGroups();

  public windowsButtons = document.getElementById('windows-buttons');
  public windowsCloseButton = document.getElementById('window-close');
  public windowsMaximizeButton = document.getElementById('window-maximize');
  public windowsMinimizeButton = document.getElementById('window-minimize');

  public toolbar = document.getElementById('toolbar');

  public back = document.getElementById('back');
  public forward = document.getElementById('forward');
  public refresh = document.getElementById('refresh');

  public toolbarSeparator1 = document.getElementById('separator-1');
  public toolbarSeparator2 = document.getElementById('separator-2');

  constructor() {
    if (platform() === 'darwin') {
      this.windowsButtons.style.display = 'none';
    }

    this.windowsCloseButton.onclick = () => {
      closeWindow();
    };

    this.windowsMaximizeButton.onclick = () => {
      maximizeWindow();
    };

    this.windowsMinimizeButton.onclick = () => {
      minimizeWindow();
    };

    ipcRenderer.on(
      'update-navigation-state',
      (e: Electron.IpcMessageEvent, data: any) => {
        if (data.canGoBack) {
          this.back.classList.remove('disabled');
        } else {
          this.back.classList.add('disabled');
        }

        if (data.canGoForward) {
          this.forward.classList.remove('disabled');
        } else {
          this.forward.classList.add('disabled');
        }
      },
    );

    requestAnimationFrame(() => {
      this.tabs.addTab();
    });

    if (platform() === 'darwin') {
      this.toolbar.style.paddingLeft = '72px';
    }

    window.addEventListener('mousemove', e => {
      this.mouse.x = e.pageX;
      this.mouse.y = e.pageY;
    });

    this.back.onclick = () => {
      this.sendNavigationAction('back');
    };

    this.forward.onclick = () => {
      this.sendNavigationAction('forward');
    };

    this.refresh.onclick = () => {
      this.sendNavigationAction('refresh');
    };
  }

  private sendNavigationAction(action: 'back' | 'forward' | 'refresh') {
    ipcRenderer.send('browserview-navigation-action', {
      id: this.tabs.selectedTabId,
      action,
    });
  }

  public mouse = {
    x: 0,
    y: 0,
  };
}

export default new App();
