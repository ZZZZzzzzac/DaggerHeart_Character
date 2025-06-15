class TriStateCheckbox {
    /**
     * Creates a tri-state checkbox.
     * @param {HTMLElement} labelElement The label element that acts as the checkbox.
     */
    constructor(labelElement) {
        this.label = labelElement;
        // State: 0 = normal, 1 = checked (full), 2 = dashed
        this.state = parseInt(this.label.dataset.state) || 0;
        this.isTwoState = this.label.classList.contains('two-state');
        this.updateVisuals();

        this.label.addEventListener('click', this.handleClick.bind(this));
        this.label.addEventListener('contextmenu', this.handleRightClick.bind(this));
    }

    handleClick(event) {
        event.preventDefault();
        // Left-click toggles between normal (0) and checked (1)
        this.state = this.state === 1 ? 0 : 1;
        this.updateVisuals();
        // saveFormStateToLocalStorage(); // Save state on change
    }

    handleRightClick(event) {
        event.preventDefault();
        if (this.isTwoState) {
            return; // Do nothing for two-state checkboxes
        }
        // Right-click toggles between normal (0) and dashed (2)
        this.state = this.state === 2 ? 0 : 2;
        this.updateVisuals();
        // saveFormStateToLocalStorage(); // Save state on change
    }

    updateVisuals() {
        this.label.dataset.state = this.state;
        this.label.classList.remove('state-checked', 'state-dashed');
        if (this.state === 1) {
            this.label.classList.add('state-checked');
        } else if (this.state === 2) {
            this.label.classList.add('state-dashed');
        }
    }

    setState(newState) {
        this.state = parseInt(newState) || 0;
        this.updateVisuals();
    }
}
