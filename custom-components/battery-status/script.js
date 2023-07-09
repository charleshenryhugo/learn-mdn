class BatteryStatus extends HTMLElement {
  constructor() {
    // this: shadow host
    super();

    // shadow host -> shadow root
    const shadowRoot = this.attachShadow({ mode: 'open' });

    // shadow host -> shadow root -> wrapper
    const wrapper = document.createElement('section');
    wrapper.classList.add('wrapper');

    const batteryStatus = document.createElement('div');
    batteryStatus.classList.add('batteryStatus');

    const batteryLevelText = document.createElement('span');
    batteryLevelText.classList.add('batteryLevelText');

    const batteryLevelBackground = document.createElement('span');
    batteryLevelBackground.classList.add('batteryLevelBackground');

    const batteryCharging = document.createElement('span');
    batteryCharging.classList.add('batteryCharging');

    batteryLevelText.textContent = 'loading...';
    const updateBatteryLevel = (battery) => {
      batteryLevelText.textContent = `${battery.level * 100}%`;
      batteryLevelBackground.style.width = `${battery.level * 100}%`;
      if (battery.level >= 0.7) {
        batteryLevelBackground.classList.remove('medium');
        batteryLevelBackground.classList.remove('low');
      } else if (battery.level >= 0.3) {
        batteryLevelBackground.classList.remove('low');
        batteryLevelBackground.classList.add('medium');
      } else {
        batteryLevelBackground.classList.remove('medium');
        batteryLevelBackground.classList.add('low');
      }
    }
    if (typeof navigator.getBattery === 'undefined') {
      batteryLevelText.textContent = 'Perhaps status API is not supported.';
    } else {
      navigator.getBattery().then(battery => {
        updateBatteryLevel(battery);
        batteryCharging.style.display = battery.charging ? 'block' : 'none';

        battery.onlevelchange = () => {
          updateBatteryLevel(battery);
        }

        battery.onchargingchange = () => {
          batteryCharging.style.display = battery.charging ? 'block' : 'none';
        }
      })
    }

    const externalStyle = document.createElement("link");
    externalStyle.setAttribute("rel", "stylesheet");
    // externalStyle.setAttribute("href", "./style.css");
    const internalStyles = document.createElement('style');
    internalStyles.textContent = this.getInternalStyles();

    wrapper.appendChild(externalStyle);
    wrapper.appendChild(internalStyles);

    batteryStatus.appendChild(batteryLevelText);
    batteryStatus.appendChild(batteryLevelBackground);
    batteryStatus.appendChild(batteryCharging);
    wrapper.appendChild(batteryStatus);

    shadowRoot.appendChild(wrapper);
  }

  getInternalStyles() {
    return `
      * {
        box-sizing: border-box;
      }

      .wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }

      .batteryStatus {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 3px;
        border: 5px solid grey;
        border-radius: 10px;
        height: 100px;
        width: 220px;
      }

      .batteryStatus::after {
        content: "";
        position: absolute;
        display: block;
        background-color: grey;
        width: 10px;
        height: 30px;
        left: calc(100% + 7px);
        top: calc(50% - 15px);
        border: 1px grey solid;
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
      }

      .batteryLevelText {
        position: absolute;
        left: 50%;
        top: 50%;
        display: block;
        transform: translate(-30%, -50%);
        font-size: 36px;
        font-weight: 600;
      }

      .batteryLevelBackground {
        width: 100%;
        height: 100%;
        border-radius: 5px;
        background-color: #06b806;
      }

      .batteryLevelBackground.medium {
        background-color: orange;
      }

      .batteryLevelBackground.low {
        background-color: red;
      }
      
      .batteryCharging {
        width: 35%;
        height: 200%;
        background-color: grey;
        opacity: 0.75;
        clip-path: polygon(66% 1%, 52% 44%, 100% 44%, 24% 100%, 39% 54%, 0 54%);
      }
    `
  }
}

customElements.define('battery-status', BatteryStatus)