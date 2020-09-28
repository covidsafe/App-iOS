import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from 'assets/colors';
import ContactList from './ContactList';
import {updateContactLog} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {strings} from 'locales/i18n';
import ContactItem from './ContactItem';

class SelectedContacts extends Component {
  onRemoveContact = contact => {
    const {selectedContacts} = this.props;
    const index = selectedContacts.findIndex(item => item.id === contact.id);
    if (index !== -1) {
      // Remove Existing contact
      selectedContacts.splice(index, 1);
      this.props.updateContactLog({
        field: 'selectedContacts',
        value: selectedContacts,
      });
    } else {
      this.props.updateContactLog({
        field: 'selectedContacts',
        value: [...selectedContacts, contact],
      });
    }
  };

  onEditContactItem = () => {
    return updatedContact => {
      console.log('lalalal updating contact reducer');
      const {selectedContacts} = this.props;
      const index = selectedContacts.findIndex(
        item => item.id === updatedContact.id,
      );
      if (index !== -1) {
        // Remove Existing contact
        console.log('Replacing itemmmm', updatedContact);
        let updatedSelectedContacts = [...selectedContacts];
        updatedSelectedContacts[index] = updatedContact;
        this.props.updateContactLog({
          field: 'selectedContacts',
          value: updatedSelectedContacts,
        });
      }
    };
  };

  render() {
    const {selectedContacts, date} = this.props;

    return (
      <>
        {selectedContacts && selectedContacts.length > 0 ? (
          <View>
            {selectedContacts.map(contact => {
              return (
                <View style={styles.contact_wrapper} key={contact.id}>
                  <ContactItem
                    noEdit={this.props.noEdit}
                    date={date}
                    contact={contact}
                    onEditContactItem={this.onEditContactItem}
                    onRemoveContact={() => this.onRemoveContact(contact)}
                  />
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.description}>{strings('socialize.text')}</Text>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    lineHeight: 18,
    color: '#141414',
    padding: 20,
    backgroundColor: 'white',
  },
  contact_wrapper: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    padding: 21,
  },
  contact: {
    fontSize: 16,
    lineHeight: 24,
    color: '#212121',
  },
});

ContactList.propTypes = {
  selectedContacts: PropTypes.array.isRequired,
  updateContactLog: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    contactLogData: state.contactLogReducer,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateContactLog
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectedContacts);
