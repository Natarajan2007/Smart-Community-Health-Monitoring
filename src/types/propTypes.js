/**
 * Common PropTypes and defaultProps for components
 */

import PropTypes from 'prop-types';

/**
 * Chat component props
 */
export const ChatComponentProps = {
  language: PropTypes.oneOf(['en', 'hi']),
  translations: PropTypes.shape({
    title: PropTypes.string,
    placeholder: PropTypes.string,
    send: PropTypes.string,
  }),
  initialMessage: PropTypes.string,
  onClose: PropTypes.func,
  onSendMessage: PropTypes.func,
};

export const ChatComponentDefaultProps = {
  language: 'en',
  initialMessage: '',
  onClose: () => {},
  onSendMessage: () => {},
};

/**
 * Quiz component props
 */
export const QuizComponentProps = {
  language: PropTypes.oneOf(['en', 'hi']),
  onComplete: PropTypes.func,
  onScoreChange: PropTypes.func,
  questions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    correct: PropTypes.number.isRequired,
    category: PropTypes.string,
    difficulty: PropTypes.oneOf(['easy', 'medium', 'hard']),
  })),
};

export const QuizComponentDefaultProps = {
  language: 'en',
  onComplete: () => {},
  onScoreChange: () => {},
  questions: [],
};

/**
 * Analytics component props
 */
export const AnalyticsComponentProps = {
  language: PropTypes.oneOf(['en', 'hi']),
  data: PropTypes.shape({
    totalUsers: PropTypes.number,
    totalSessions: PropTypes.number,
    averageScore: PropTypes.number,
  }),
  updateInterval: PropTypes.number, // ms
  onError: PropTypes.func,
};

export const AnalyticsComponentDefaultProps = {
  language: 'en',
  data: null,
  updateInterval: 5000,
  onError: () => {},
};

/**
 * Form component props
 */
export const FormComponentProps = {
  language: PropTypes.oneOf(['en', 'hi']),
  onSubmit: PropTypes.func.isRequired,
  onError: PropTypes.func,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    required: PropTypes.bool,
    validation: PropTypes.func,
  })),
  submitButtonText: PropTypes.string,
  isLoading: PropTypes.bool,
};

export const FormComponentDefaultProps = {
  language: 'en',
  onError: () => {},
  fields: [],
  submitButtonText: 'Submit',
  isLoading: false,
};

/**
 * Alert/Notification props
 */
export const AlertComponentProps = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  duration: PropTypes.number, // ms, 0 = no auto-dismiss
  position: PropTypes.oneOf(['top', 'bottom', 'top-right', 'bottom-right']),
};

export const AlertComponentDefaultProps = {
  type: 'info',
  title: '',
  dismissible: true,
  onDismiss: () => {},
  duration: 5000,
  position: 'top-right',
};

/**
 * Header/Navigation props
 */
export const HeaderComponentProps = {
  language: PropTypes.oneOf(['en', 'hi']),
  onLanguageChange: PropTypes.func,
  isDarkMode: PropTypes.bool,
  onDarkModeToggle: PropTypes.func,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.string,
  })),
};

export const HeaderComponentDefaultProps = {
  language: 'en',
  onLanguageChange: () => {},
  isDarkMode: false,
  onDarkModeToggle: () => {},
  menuItems: [],
};

export default {
  ChatComponentProps,
  QuizComponentProps,
  AnalyticsComponentProps,
  FormComponentProps,
  AlertComponentProps,
  HeaderComponentProps,
};
