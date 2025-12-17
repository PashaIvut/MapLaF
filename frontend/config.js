// ============================================================================
// КОНСТАНТЫ И КОНФИГУРАЦИЯ
// ============================================================================

const API_URL = window.location.origin + '/graphql';

const SECTIONS = {
    'found': { section: 'found-section', nav: 'nav-found', action: 'loadFoundItems' },
    'lost': { section: 'lost-section', nav: 'nav-lost', action: 'loadLostItems' },
    'my-found': { section: 'my-found-section', nav: 'nav-my-found', action: 'loadMyFoundItems' },
    'my-lost': { section: 'my-lost-section', nav: 'nav-my-lost', action: 'loadMyLostItems' },
    'my-claimed': { section: 'my-claimed-section', nav: 'nav-my-claimed', action: 'loadMyClaimedFoundItems' },
    'add-found': { section: 'add-found-section', nav: 'nav-add-found', action: 'initAddFoundMap' },
    'add-lost': { section: 'add-lost-section', nav: 'nav-add-lost', action: 'initAddLostMap' }
};

// ============================================================================
// DOM ЭЛЕМЕНТЫ
// ============================================================================

const auth = document.getElementById('auth');
const app = document.getElementById('app');
const authForm = document.getElementById('auth-form');
const nameInput = document.getElementById('name');
const passwordInput = document.getElementById('password');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const error = document.getElementById('error');
const nameError = document.getElementById('name-error');
const passwordError = document.getElementById('password-error');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const userName = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout');

const navFound = document.getElementById('nav-found');
const navLost = document.getElementById('nav-lost');
const navMyFound = document.getElementById('nav-my-found');
const navMyLost = document.getElementById('nav-my-lost');
const navMyClaimed = document.getElementById('nav-my-claimed');
const navAddFound = document.getElementById('nav-add-found');
const navAddLost = document.getElementById('nav-add-lost');

const foundSection = document.getElementById('found-section');
const lostSection = document.getElementById('lost-section');
const addFoundSection = document.getElementById('add-found-section');
const addLostSection = document.getElementById('add-lost-section');

const foundList = document.getElementById('found-list');
const lostList = document.getElementById('lost-list');

const addFoundForm = document.getElementById('add-found-form');
const addLostForm = document.getElementById('add-lost-form');

// ============================================================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ СОСТОЯНИЯ
// ============================================================================

let currentUser = null;
let foundMap = null;
let lostMap = null;
let foundItemsMap = null;
let lostItemsMap = null;
let foundMapMarkers = [];
let lostMapMarkers = [];
const markerCoordsMap = new Map();
let foundMapMarker = null;
let lostMapMarker = null;
let foundMapCoords = null;
let lostMapCoords = null;
let nearbyMode = false;
let nearbySearchMarker = null;
let nearbySearchCircle = null;
let nearbyModeLost = false;
let nearbySearchMarkerLost = null;
let nearbySearchCircleLost = null;

let currentFoundSearchQuery = '';
let currentLostSearchQuery = '';
