<template>
  <div class="dropdown-container" ref="dropdownContainer">
    <p class="dropdown-label">
      Les flèches ne fonctionnent que lorsque vous cliquez sur le menu déroulant
    </p>

    <div class="dropdown" @click="toggleDropdown" ref="dropdownButton">
      <div class="selected">
        {{ selectedLabel }}
      </div>
      <div class="arrow">▲</div>
    </div>

    <!-- Menu options en dehors du flux normal -->
    <ul
      v-if="isOpen"
      class="options"
      :style="optionsStyle"
      ref="optionsList"
    >
      <li
        v-for="option in options"
        :key="option.value"
        @click.stop="selectOption(option)"
        :class="{ selected: option.value === modelValue }"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Dropdown",
  props: {
    modelValue: String,
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isOpen: false,
      optionsStyle: {}
    };
  },
  computed: {
    selectedLabel() {
      return this.options.find(o => o.value === this.modelValue)?.label || "Choisir...";
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) this.positionOptions();
    },
    selectOption(option) {
      this.$emit("update:modelValue", option.value);
      this.isOpen = false;
    },
    positionOptions() {
      const button = this.$refs.dropdownButton;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      // position fixe par rapport à la fenêtre
      this.optionsStyle = {
        position: 'fixed',
        width: `${rect.width}px`,
        left: `${rect.left}px`,
        top: `${rect.top - button.offsetHeight - 8}px`, // au-dessus du bouton avec 8px d'espace
        zIndex: 1000
      };
    }
  }
};
</script>

<style scoped>
/* Conteneur global */
.dropdown-container {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

/* Texte explicatif */
.dropdown-label {
  color: #E0E6F0;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
}

/* Menu principal */
.dropdown {
  width: 260px;
  margin: 0 auto;
  background-color: #0F0F2F/80;
  border-radius: 1rem;
  border: 1px solid #0F0F2F/50;
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
  color: #E0E6F0;
  transition: all 0.3s;
}

.dropdown:hover {
  border-color: #C96BFF;
  box-shadow: 0 0 15px rgba(201,107,255,0.45);
}

/* Texte sélectionné */
.selected {
  color: #C96BFF;
}

/* Flèche toujours vers le haut */
.arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #C96BFF;
  pointer-events: none;
}

/* Liste des options */
.options {
  background-color: #011c2f;
  border: 2px solid #C96BFF;
  border-radius: 6px;
  list-style: none;
  padding: 0;
}

/* Option par défaut */
.options li {
  padding: 10px;
  color: #E0E6F0;
  transition: 0.15s ease;
}

/* Survol */
.options li:hover {
  background-color: #C96BFF;
  color: #011c2f;
}

/* Option sélectionnée */
.options li.selected {
  background-color: #C96BFF;
  color: #011c2f;
}
</style>
