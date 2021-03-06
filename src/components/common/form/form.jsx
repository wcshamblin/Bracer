import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import TextArea from "./textArea";
import NumInput from "./numInput";
import Checkbox from "./checkbox";
import Select from "./select";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    if (input.type === "number") {
      data[input.name] = parseInt(input.value);
    } else if (input.type === "checkbox") {
      data[input.value] = input.checked ? true : false;
      data[input.name] = data[input.value];
    } else {
      data[input.name] = input.value;
    }

    if (input.type === "number") {
      this.setState({ data, errors }, this.doSubmit);
    }

    this.setState({ data, errors });
  };

  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderSelect(name, label, options, disabled) {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        disabled={disabled}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderInput(name, label, type) {
    const { data, errors } = this.state;

    return (
      <Input
        name={name}
        type={type}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderTextArea(name, label) {
    const { data, errors } = this.state;

    return (
      <TextArea
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderNumInput(name, label, disabled, type = "number") {
    const { data, errors } = this.state;

    return (
      <NumInput
        type={type}
        name={name}
        value={data[name]}
        label={label}
        disabled={disabled}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderCheckbox(name, label, type = "checkbox") {
    const { data, errors } = this.state;

    return (
      <Checkbox
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
}

export default Form;
