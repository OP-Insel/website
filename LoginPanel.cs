// File: LoginPanel.cs
// Handles the login and registration UI

using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class LoginPanel : MonoBehaviour
{
    [Header("Login Fields")]
    public TMP_InputField emailInput;
    public TMP_InputField passwordInput;
    public Button loginButton;
    public TextMeshProUGUI errorText;
    
    [Header("Register Fields")]
    public GameObject registerPanel;
    public TMP_InputField registerUsernameInput;
    public TMP_InputField registerEmailInput;
    public TMP_InputField registerPasswordInput;
    public TMP_InputField registerConfirmPasswordInput;
    public Button registerButton;
    public TextMeshProUGUI registerErrorText;
    
    [Header("Panel Navigation")]
    public Button showRegisterButton;
    public Button showLoginButton;
    
    private TeamManagementSystem teamSystem;
    
    void Start()
    {
        teamSystem = TeamManagementSystem.Instance;
        
        // Set up login button
        loginButton.onClick.AddListener(HandleLogin);
        
        // Set up register button
        registerButton.onClick.AddListener(HandleRegister);
        
        // Set up panel navigation
        showRegisterButton.onClick.AddListener(() => {
            registerPanel.SetActive(true);
            errorText.text = "";
        });
        
        showLoginButton.onClick.AddListener(() => {
            registerPanel.SetActive(false);
            registerErrorText.text = "";
        });
        
        // Hide error messages initially
        errorText.text = "";
        registerErrorText.text = "";
        
        // Start with login panel
        registerPanel.SetActive(false);
    }
    
    private void HandleLogin()
    {
        string email = emailInput.text.Trim();
        string password = passwordInput.text;
        
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            errorText.text = "Please enter both email and password.";
            return;
        }
        
        bool success = teamSystem.Login(email, password);
        
        if (!success)
        {
            errorText.text = "Invalid email or password.";
            passwordInput.text = "";
        }
    }
    
    private void HandleRegister()
    {
        string username = registerUsernameInput.text.Trim();
        string email = registerEmailInput.text.Trim();
        string password = registerPasswordInput.text;
        string confirmPassword = registerConfirmPasswordInput.text;
        
        // Validate inputs
        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(email) || 
            string.IsNullOrEmpty(password) || string.IsNullOrEmpty(confirmPassword))
        {
            registerErrorText.text = "Please fill in all fields.";
            return;
        }
        
        if (password != confirmPassword)
        {
            registerErrorText.text = "Passwords do not match.";
            registerPasswordInput.text = "";
            registerConfirmPasswordInput.text = "";
            return;
        }
        
        bool success = teamSystem.Register(username, email, password);
        
        if (success)
        {
            registerErrorText.text = "Registration successful! You can now login.";
            registerErrorText.color = Color.green;
            
            // Clear fields
            registerUsernameInput.text = "";
            registerEmailInput.text = "";
            registerPasswordInput.text = "";
            registerConfirmPasswordInput.text = "";
            
            // Switch back to login panel after a delay
            Invoke("SwitchToLoginPanel", 2f);
        }
        else
        {
            registerErrorText.text = "Registration failed. Username or email already exists.";
            registerErrorText.color = Color.red;
        }
    }
    
    private void SwitchToLoginPanel()
    {
        registerPanel.SetActive(false);
        registerErrorText.text = "";
    }
}
