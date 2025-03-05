// Filename: MinecraftUIStyle.cs
// Applies Minecraft-style UI theming

using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class MinecraftUIStyle : MonoBehaviour
{
    [Header("Colors")]
    public Color backgroundColor = new Color(0.235f, 0.165f, 0.102f); // Dirt brown
    public Color containerColor = new Color(0.173f, 0.118f, 0.071f); // Dark brown
    public Color buttonColor = new Color(0.404f, 0.490f, 0.408f); // Button green
    public Color buttonHoverColor = new Color(0.482f, 0.604f, 0.486f); // Light green
    public Color buttonPressedColor = new Color(0.337f, 0.404f, 0.337f); // Dark green
    public Color textColor = new Color(0.933f, 0.933f, 0.933f); // Off-white
    public Color goldColor = new Color(1f, 0.843f, 0f); // Gold
    public Color errorColor = new Color(1f, 0.2f, 0.2f); // Red
    public Color successColor = new Color(0.2f, 0.8f, 0.2f); // Green
    
    [Header("Fonts")]
    public TMP_FontAsset minecraftFont;
    
    [Header("Textures")]
    public Sprite buttonTexture;
    public Sprite containerTexture;
    public Sprite inputFieldTexture;
    
    void Start()
    {
        // Apply Minecraft style on start
        ApplyMinecraftStyle();
    }
    
    public void ApplyMinecraftStyle()
    {
        // Apply to all panels
        ApplyStyleToPanels();
        
        // Apply to all buttons
        ApplyStyleToButtons();
        
        // Apply to all text
        ApplyStyleToText();
        
        // Apply to all input fields
        ApplyStyleToInputFields();
        
        // Apply to all dropdowns
        ApplyStyleToDropdowns();
    }
    
    private void ApplyStyleToPanels()
    {
        Image[] panels = FindObjectsOfType<Image>(true);
        
        foreach (Image panel in panels)
        {
            // Skip buttons, input fields, etc.
            if (panel.GetComponent<Button>() != null || 
                panel.GetComponent<InputField>() != null ||
                panel.GetComponent<TMP_Dropdown>() != null)
                continue;
            
            // Apply container texture if available, otherwise use color
            if (containerTexture != null)
            {
                panel.sprite = containerTexture;
                panel.type = Image.Type.Sliced;
            }
            else
            {
                panel.color = containerColor;
            }
        }
    }
    
    private void ApplyStyleToButtons()
    {
        Button[] buttons = FindObjectsOfType<Button>(true);
        
        foreach (Button button in buttons)
        {
            ColorBlock colors = button.colors;
            colors.normalColor = buttonColor;
            colors.highlightedColor = buttonHoverColor;
            colors.pressedColor = buttonPressedColor;
            colors.selectedColor = buttonHoverColor;
            colors.disabledColor = new Color(buttonColor.r, buttonColor.g, buttonColor.b, 0.5f);
            colors.colorMultiplier = 1f;
            colors.fadeDuration = 0.1f;
            button.colors = colors;
            
            // Apply button texture if available
            if (buttonTexture != null)
            {
                Image buttonImage = button.GetComponent<Image>();
                if (buttonImage != null)
                {
                    buttonImage.sprite = buttonTexture;
                    buttonImage.type = Image.Type.Sliced;
                }
            }
            
            // Apply font to button text
            TextMeshProUGUI buttonText = button.GetComponentInChildren<TextMeshProUGUI>();
            if (buttonText != null && minecraftFont != null)
            {
                buttonText.font = minecraftFont;
                buttonText.color = textColor;
            }
        }
    }
    
    private void ApplyStyleToText()
    {
        TextMeshProUGUI[] texts = FindObjectsOfType<TextMeshProUGUI>(true);
        
        foreach (TextMeshProUGUI text in texts)
        {
            if (minecraftFont != null)
            {
                text.font = minecraftFont;
            }
            
            // Don't override specific text colors (like rank colors)
            if (text.color == Color.white)
            {
                text.color = textColor;
            }
        }
    }
    
    private void ApplyStyleToInputFields()
    {
        TMP_InputField[] inputFields = FindObjectsOfType<TMP_InputField>(true);
        
        foreach (TMP_InputField inputField in inputFields)
        {
            // Apply input field texture if available
            if (inputFieldTexture != null)
            {
                Image inputImage = inputField.GetComponent<Image>();
                if (inputImage != null)
                {
                    inputImage.sprite = inputFieldTexture;
                    inputImage.type = Image.Type.Sliced;
                }
            }
            
            // Apply font to input field text
            if (minecraftFont != null)
            {
                inputField.textComponent.font = minecraftFont;
                
                TextMeshProUGUI placeholderText = inputField.placeholder as TextMeshProUGUI;
                if (placeholderText != null)
                {
                    placeholderText.font = minecraftFont;
                }
            }
        }
    }
    
    private void ApplyStyleToDropdowns()
    {
        TMP_Dropdown[] dropdowns = FindObjectsOfType<TMP_Dropdown>(true);
        
        foreach (TMP_Dropdown dropdown in dropdowns)
        {
            // Apply button texture to dropdown
            if (buttonTexture != null)
            {
                Image dropdownImage = dropdown.GetComponent<Image>();
                if (dropdownImage != null)
                {
                    dropdownImage.sprite = buttonTexture;
                    dropdownImage.type = Image.Type.Sliced;
                }
                
                Image templateImage = dropdown.template.GetComponent<Image>();
                if (templateImage != null)
                {
                    templateImage.sprite = containerTexture;
                    templateImage.type = Image.Type.Sliced;
                }
            }
            
            // Apply font to dropdown text
            if (minecraftFont != null)
            {
                dropdown.cap
