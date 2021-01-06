import React from "react";
import Form from "./common/form/form";
import Joi from "joi-browser";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import questionmark from "../question-mark.png";
import { getImg, getNatures } from "../utils/pokeApi";
import { capitalize } from "../utils/capitalize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

class TargetForm extends Form {
  state = {
    data: {
      name: "",
      nature: "Adamant",
      hp: 31,
      atk: 31,
      def: 31,
      spa: 31,
      spd: 31,
      spe: 31,
    },
    active: {
      nature: true,
      hp: true,
      atk: true,
      def: true,
      spa: true,
      spd: true,
      spe: true,
    },
    url: questionmark,
    allNatures: [],
    errors: {},
  };

  schema = {
    name: Joi.string().required(),
    nature: Joi.string(),
    hp: Joi.number().integer().min(0).max(31),
    atk: Joi.number().integer().min(0).max(31),
    def: Joi.number().integer().min(0).max(31),
    spa: Joi.number().integer().min(0).max(31),
    spd: Joi.number().integer().min(0).max(31),
    spe: Joi.number().integer().min(0).max(31),
  };

  async componentDidMount() {
    //populate natures input
    const { data } = await getNatures();
    const allNatures = data.results
      .map((nature) => capitalize(nature.name))
      .sort();

    this.setState({ allNatures });

    //populate form with existing target
    const { target } = this.props;
    if (!_.isEmpty(target)) {
      const url = await getImg(target.name.toLowerCase());
      this.setState({ data: target, url });
    }

    console.log("target: ", target);
    console.log("state: ", this.state);
  }

  doSubmit = () => {
    this.props.dataSubmit(this.state.data, "target");
  };

  handleInputChange = async (selected) => {
    if (selected.length === 0) return;
    const name = selected[0];
    const url = await getImg(name.toLowerCase());
    this.setState({ data: { ...this.state.data, name }, url });
  };

  disableStat = (input) => {
    let stat = this.state.active[input];
    stat = !stat;

    this.setState({ active: { ...this.state.active, [input]: stat } });
  };

  render() {
    const { url, allNatures, active } = this.state;
    const stats = ["hp", "atk", "def", "spa", "spd", "spe", "nature"];
    const { allPokes } = this.props;

    return (
      <React.Fragment>
        <h4 className="text-center mt-2 user-select-none">Add your pokemon:</h4>
        <div className="col-lg-4 offset-lg-4 card text-center user-select-none">
          <form id="reset" onSubmit={this.handleSubmit}>
            {/* INPUT BOX */}
            <Typeahead
              id="typeahead"
              placeholder="Add a pokemon..."
              minLength={2}
              highlightOnlyResult
              onChange={(selected) => this.handleInputChange(selected)}
              options={allPokes}
            ></Typeahead>
            <div className="col-6 d-inline-block">
              <img
                src={url}
                alt="hello"
                style={{ border: "1px solid black" }}
              />
            </div>
            <div className="col-6 d-inline-block">
              {/* IV INPUTS */}
              {stats.map((stat) => (
                <div key={stat}>
                  <div className="col-8 d-inline-block">
                    {stat !== "nature" &&
                      this.renderNumInput(
                        stat,
                        stat.toUpperCase(),
                        !active[stat]
                      )}
                    {stat === "nature" &&
                      this.renderSelect(
                        "nature",
                        "Nature",
                        allNatures,
                        !active[stat]
                      )}
                  </div>
                  <div className="col-4 d-inline-block">
                    <button
                      onClick={() => this.disableStat(stat)}
                      className={`btn btn-${
                        active[stat] ? "success" : "danger"
                      }`}
                      type="button"
                    >
                      <FontAwesomeIcon
                        icon={active[stat] ? faCheck : faBan}
                      ></FontAwesomeIcon>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {this.renderButton("Enter")}
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default TargetForm;
