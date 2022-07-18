import FormModal from '@/components/modal/FormModal';
import { formLayout } from '@/components/modal/BaseFormModal';
import { Form } from 'antd';
import React from 'react';
import { reqUpdateBaseUserPassword } from '@/services/BaseUserService';
import PasswordAndConfirmFormItem
  from '@/pages/open/register/components/PasswordAndConfirmFormItem';
import PasswordFormItem
  from '@/pages/open/register/components/PasswordFormItem';

const UpdatePasswordModal = (props) => {

  const {
    // state
    visible, setVisible,

    // 数据
    currentBaseUser,
  } = props;

  const [form] = Form.useForm();

  const generateBody = (values) => {
    const id = currentBaseUser.id;
    const oldPassword = values.oldPassword;
    const password = values.password;
    const confirmPassword = values.confirmPassword;

    return {
      id,
      oldPassword,
      password,
      confirmPassword,
    };
  };

  return (
    <FormModal title='申请库存' form={form} successMessage='修改成功'
               visible={visible} setVisible={setVisible}
               rowData={{}}
               generateBody={generateBody}
               reqMethod={reqUpdateBaseUserPassword}>
      <Form {...formLayout} initialValues={{}} form={form}
            name='update-password'>
        <PasswordFormItem name={'oldPassword'} label={'旧密码'}/>
        <PasswordAndConfirmFormItem passwordLabel={'新密码'} confirmPasswordLabel={'确认密码'}/>
      </Form>
    </FormModal>
  );

};

export default UpdatePasswordModal;
