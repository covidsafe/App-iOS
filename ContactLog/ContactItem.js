import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CustomIcon from 'assets/icons/CustomIcon.js';
import colors from 'assets/colors';
import {updateSymptom, clearSymptoms} from './actions.js';
import {bindActionCreators} from 'redux';
import Modal from 'views/Modal';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import {connectActionSheet} from '@expo/react-native-action-sheet';
import Edit from './NewContact/EditContact';
import Save from './NewContact/SaveContact';
import {editContact} from './NewContact/actions.js';
import Person from 'utils/person';

class ContactItemComp extends Component {
  constructor() {
    super();
    this.state = {
      addContactModalOn: false,
    };
  }

  openManualContactModal = () => {
    this.setState({
      addContactModalOn: true,
    });
  };

  closeManualContactModal = () => {
    this.setState({
      addContactModalOn: false,
    });
  };

  handleAction = () => {
    this.props.showActionSheetWithOptions({
      options: [
        strings('contact_item.cancel'),
        strings('contact_item.edit'),
        strings('contact_item.delete')
      ],
      destructiveButtonIndex: 2,
      cancelButtonIndex: 0,
    }, buttonIndex => {
      if (buttonIndex === 1) {
        const {
          contact: {name, phone, label, notes, id},
        } = this.props;
        this.props.editContact({
          name,
          phone,
          label,
          notes,
          id,
          enableSave: false,
        });
        this.openManualContactModal();
      } else if (buttonIndex === 2) {
        Person.deleteContact(this.props.contact);
        this.props.onRemoveContact();
      }
    });
  };

  render() {
    const {
      contact: {name, notes},
    } = this.props;

    const saveButton = (
      <Save
        editContactData={this.props.contact}
        date={this.props.date}
        isEditing={true}
        handleSaveSuccess={() => {
          this.closeManualContactModal();
        }}
        onEditContactItem={this.props.onEditContactItem}
      />
    );

    return (
      <>
        <Modal
          visible={this.state.addContactModalOn}
          handleModalClose={this.closeManualContactModal}
          title={strings('create.contact')}
          actionButton={saveButton}>
          <Edit newContactData={this.props.contact} />
        </Modal>
        <View style={styles.container}>
          <View style={styles.detail}>
            <Text style={styles.title}>{name}</Text>
            {notes && <Text style={styles.notes}>{notes}</Text>}
          </View>
          <TouchableOpacity
            style={styles.action_button}
            onPress={this.handleAction}>
            <CustomIcon name={'action24'} size={20} color={colors.gray_icon} />
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detail: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.module_title,
  },
  notes: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.secondary_body_copy,
  },
  action_button: {
    paddingLeft: 20,
    paddingRight: 15,
  },
});

const mapStateToProps = state => {
  return {
    symptoms: state.symptomReducer,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateSymptom,
      clearSymptoms,
      editContact,
    },
    dispatch,
  );

const ContactItem = connectActionSheet(ContactItemComp);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactItem);
