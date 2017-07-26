import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';

//redine reducers
const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                text: action.text,
                id: action.id,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }
            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};
const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [...state, todo(state, action)];
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};
const visibilityFilter = (state = 'SHOW_ALL', action) => {
    console.log('in visibility filter, filter = ', action.filter);
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

//Acitons
let nextTodoId = 0;
const addTodo = text => {
    return {
        type: 'ADD_TODO',
        text: text,
        id: nextTodoId++
    };
};
const toggleTodo = id => {
    return {
        type: 'TOGGLE_TODO',
        id: id
    };
};
const setVisibilityFilter = filter => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter: filter
    };
};

let AddTodo = ({ dispatch }) => {
    let input;
    return (
        <div>
            <input type="text" ref={node => (input = node)} />
            <input
                type="button"
                value="Add Todo"
                onClick={e => {
                    e.preventDefault();
                    dispatch(addTodo(input.value));
                    input.value = '';
                }}
            />
        </div>
    );
};

AddTodo = connect()(AddTodo);
const TodoList = ({ todos, onClick }) => {
    console.log(todos);
    return (
        <div>
            <ul>
                {todos.map(todo => {
                    return (
                        <li
                            key={todo.id}
                            onClick={() => {
                                onClick(todo.id);
                            }}
                            style={{
                                textDecoration: todo.completed
                                    ? 'line-through'
                                    : 'none'
                            }}
                        >
                            {todo.text}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ACTIVE':
            return todos.filter(todo => !todo.completed);
        case 'SHOW_COMPLETED':
            return todos.filter(todo => todo.completed);
        default:
            return [...todos];
    }
};
const mapStateToTodoListProps = state => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    };
};
const mapDispatchToTodoListProps = dispatch => {
    return {
        onClick: id => {
            dispatch(toggleTodo(id));
        }
    };
};
const VisibleTodoList = connect(
    mapStateToTodoListProps,
    mapDispatchToTodoListProps
)(TodoList);

const Link = ({ filter, active, onFilterClick, children }) => {
    if (active) {
        return (
            <span>
                {children}
            </span>
        );
    }
    return (
        <a
            href="#"
            onClick={e => {
                e.preventDefault();
                onFilterClick(filter);
            }}
        >
            {children}
        </a>
    );
};
const mapStateToLinkProps = (state, ownProps) => {
    console.log('state.visibilityFilter', state.visibilityFilter);
    return {
        active: ownProps.filter === state.visibilityFilter
    };
};
const mapDispatchToLinkProps = dispatch => {
    return {
        onFilterClick: filter => {
            console.log('filter in the filterlink', filter);
            dispatch(setVisibilityFilter(filter));
        }
    };
};
const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);
const Footer = () => {
    return (
        <div>
            Show: <FilterLink filter="SHOW_ALL">All</FilterLink>{' '}
            <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>{' '}
            <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
        </div>
    );
};
const TodoApp = () => {
    return (
        <div>
            <AddTodo />
            <VisibleTodoList />
            <Footer />
        </div>
    );
};
const todosApp = combineReducers({
    todos,
    visibilityFilter
});
ReactDOM.render(
    <Provider store={createStore(todosApp)}>
        <TodoApp />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
