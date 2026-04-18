'use strict';

// ===== Máscaras =====
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', () => {
  let v = phoneInput.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
  else if (v.length) v = `(${v}`;
  phoneInput.value = v;
});

const cpfInput = document.getElementById('cpf');
cpfInput.addEventListener('input', () => {
  let v = cpfInput.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 9)      v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
  else if (v.length > 6) v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
  else if (v.length > 3) v = `${v.slice(0,3)}.${v.slice(3)}`;
  cpfInput.value = v;
});

// ===== Contador de bio =====
const bioInput = document.getElementById('bio');
const bioCount = document.getElementById('bioCount');
bioInput.addEventListener('input', () => { bioCount.textContent = bioInput.value.length; });

// ===== Força da senha =====
const passwordInput = document.getElementById('password');
const strengthFill  = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

const strengthLevels = [
  { label: '',         color: '',            width: '0%'  },
  { label: 'Fraca',   color: '#ef4444',      width: '25%' },
  { label: 'Regular', color: '#f59e0b',      width: '55%' },
  { label: 'Boa',     color: '#22c55e',      width: '80%' },
  { label: 'Forte',   color: '#16a34a',      width: '100%'},
];

passwordInput.addEventListener('input', () => {
  const val = passwordInput.value;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const lvl = strengthLevels[score];
  strengthFill.style.width = lvl.width;
  strengthFill.style.background = lvl.color;
  strengthLabel.textContent = lvl.label;
  strengthLabel.style.color = lvl.color;
});

// ===== Mostrar / ocultar senha =====
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    target.type = target.type === 'password' ? 'text' : 'password';
  });
});

// ===== Validação =====
function showError(fieldId, msg) {
  const el = document.getElementById(`${fieldId}-error`);
  const input = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`);
  if (el) el.textContent = msg;
  if (input) { input.classList.add('invalid'); input.classList.remove('valid'); }
}

function clearError(fieldId) {
  const el = document.getElementById(`${fieldId}-error`);
  const input = document.getElementById(fieldId);
  if (el) el.textContent = '';
  if (input) { input.classList.remove('invalid'); input.classList.add('valid'); }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidCPF(cpf) {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let r = 11 - (sum % 11);
  if (r > 9) r = 0;
  if (r !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  r = 11 - (sum % 11);
  if (r > 9) r = 0;
  return r === parseInt(digits[10]);
}

function validateForm() {
  let valid = true;

  // Nome
  const fullName = document.getElementById('fullName').value.trim();
  if (fullName.length < 3) { showError('fullName', 'Informe seu nome completo.'); valid = false; }
  else clearError('fullName');

  // Email
  const email = document.getElementById('email').value.trim();
  if (!isValidEmail(email)) { showError('email', 'Informe um e-mail válido.'); valid = false; }
  else clearError('email');

  // Telefone
  const phone = document.getElementById('phone').value.replace(/\D/g, '');
  if (phone.length < 10) { showError('phone', 'Informe um telefone válido.'); valid = false; }
  else clearError('phone');

  // CPF
  const cpf = document.getElementById('cpf').value;
  if (!isValidCPF(cpf)) { showError('cpf', 'CPF inválido.'); valid = false; }
  else clearError('cpf');

  // Data de nascimento
  const birthDate = document.getElementById('birthDate').value;
  if (!birthDate) { showError('birthDate', 'Informe sua data de nascimento.'); valid = false; }
  else {
    const age = (new Date() - new Date(birthDate)) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 18) { showError('birthDate', 'Você deve ter ao menos 18 anos.'); valid = false; }
    else clearError('birthDate');
  }

  // Estado
  const state = document.getElementById('state').value;
  if (!state) { showError('state', 'Selecione seu estado.'); valid = false; }
  else clearError('state');

  // Área de atuação
  const category = document.getElementById('category').value;
  if (!category) { showError('category', 'Selecione sua área de atuação.'); valid = false; }
  else clearError('category');

  // Nível
  const experience = document.getElementById('experience').value;
  if (!experience) { showError('experience', 'Selecione seu nível.'); valid = false; }
  else clearError('experience');

  // Habilidades
  const skills = document.getElementById('skills').value.trim();
  if (skills.length < 2) { showError('skills', 'Informe ao menos uma habilidade.'); valid = false; }
  else clearError('skills');

  // Bio
  const bio = document.getElementById('bio').value.trim();
  if (bio.length < 50) { showError('bio', 'A apresentação deve ter ao menos 50 caracteres.'); valid = false; }
  else clearError('bio');

  // Valor por hora
  const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);
  if (!hourlyRate || hourlyRate < 10) { showError('hourlyRate', 'Informe um valor por hora (mínimo R$ 10).'); valid = false; }
  else clearError('hourlyRate');

  // Portfólio (opcional, mas valida se preenchido)
  const portfolio = document.getElementById('portfolio').value.trim();
  if (portfolio && !/^https?:\/\/.+/.test(portfolio)) {
    showError('portfolio', 'Informe uma URL válida (começando com http:// ou https://).'); valid = false;
  } else { clearError('portfolio'); }

  // Disponibilidade
  const availability = document.getElementById('availability').value;
  if (!availability) { showError('availability', 'Selecione sua disponibilidade.'); valid = false; }
  else clearError('availability');

  // Modalidade
  const workMode = document.getElementById('workMode').value;
  if (!workMode) { showError('workMode', 'Selecione a modalidade.'); valid = false; }
  else clearError('workMode');

  // Senha
  const password = document.getElementById('password').value;
  if (password.length < 8) { showError('password', 'A senha deve ter ao menos 8 caracteres.'); valid = false; }
  else clearError('password');

  // Confirmar senha
  const confirmPassword = document.getElementById('confirmPassword').value;
  if (confirmPassword !== password) { showError('confirmPassword', 'As senhas não coincidem.'); valid = false; }
  else clearError('confirmPassword');

  // Termos
  const terms = document.getElementById('terms').checked;
  if (!terms) {
    document.getElementById('terms-error').textContent = 'Você deve aceitar os termos para continuar.';
    valid = false;
  } else {
    document.getElementById('terms-error').textContent = '';
  }

  return valid;
}

// Validação em tempo real
document.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('blur', () => {
    if (field.id) validateField(field.id);
  });
});

function validateField(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('invalid', 'valid');
  const errEl = document.getElementById(`${id}-error`);
  if (errEl) errEl.textContent = '';
}

// ===== Submit =====
const form      = document.getElementById('freelancerForm');
const submitBtn = document.getElementById('submitBtn');
const btnText   = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    const firstError = form.querySelector('.invalid, input.invalid, select.invalid, textarea.invalid');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Simula envio
  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoader.hidden = false;

  await new Promise(r => setTimeout(r, 1800));

  submitBtn.disabled = false;
  btnText.hidden = false;
  btnLoader.hidden = true;

  document.getElementById('successModal').hidden = false;
  document.body.style.overflow = 'hidden';
});

// ===== Modal =====
function closeModal() {
  document.getElementById('successModal').hidden = true;
  document.body.style.overflow = '';
  form.reset();
  document.querySelectorAll('input, select, textarea').forEach(f => f.classList.remove('valid', 'invalid'));
  bioCount.textContent = '0';
  strengthFill.style.width = '0';
  strengthLabel.textContent = '';
}

document.getElementById('successModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});
