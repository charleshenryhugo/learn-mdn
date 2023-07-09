class ExpandingList extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' }); // same as this.shadowRoot

    const styles = document.createElement('style');
    styles.textContent = `
    `

    const wrapper = document.createElement('div');
    wrapper.style.border = '1px solid black';

    const expandTrigger = document.createElement('span');
    expandTrigger.textContent = 'Click me to expand...';
    expandTrigger.style.cursor = 'pointer';

    const expandContent = document.createElement('p');
    expandContent.textContent = this.hasAttribute('data-text')
      ? this.getAttribute('data-text')
      : 'no data text specified...';
    
    expandContent.style.display = 'none';

    expandTrigger.addEventListener('click', () => {
      if (expandContent.style.display === 'block') {
        expandContent.style.display = 'none';
      } else {
        expandContent.style.display = 'block';
      }
    })

    wrapper.appendChild(expandTrigger);
    wrapper.appendChild(expandContent);

    shadowRoot.appendChild(wrapper);

  }
}

customElements.define('expanding-list', ExpandingList);
